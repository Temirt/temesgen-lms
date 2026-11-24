<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjectSubmission;
use App\Models\RealWorldProject;
use App\Models\UserSkill;
use App\Models\Skill;
use App\Models\UserBadge;
use App\Models\Badge;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Get real-world projects, optionally filtered by course.
     */
    public function index(Request $request)
    {
        $userId = $request->user()?->id;
        $courseId = $request->query('course_id');

        $query = RealWorldProject::with(['course:id,title,thumbnail', 'instructor:id,name,avatar']);

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        $projects = $query->get()->map(function ($proj) use ($userId) {
            $submission = null;
            if ($userId) {
                $submission = ProjectSubmission::where('project_id', $proj->id)
                    ->where('user_id', $userId)
                    ->first();
            }

            return [
                'id' => $proj->id,
                'title' => $proj->title,
                'description' => $proj->description,
                'scenario' => $proj->scenario,
                'requirements' => $proj->requirements,
                'deliverables' => $proj->deliverables,
                'skills_developed' => $proj->skills_developed,
                'difficulty' => $proj->difficulty,
                'estimated_hours' => $proj->estimated_hours,
                'max_score' => $proj->max_score,
                'passing_score' => $proj->passing_score,
                'course' => $proj->course,
                'instructor' => $proj->instructor,
                'has_submitted' => $submission !== null,
                'submission' => $submission,
            ];
        });

        return response()->json($projects);
    }

    /**
     * Get specific project details.
     */
    public function show(Request $request, $id)
    {
        $userId = $request->user()?->id;
        $project = RealWorldProject::with(['course', 'instructor:id,name,avatar,headline'])->findOrFail($id);

        $submission = null;
        if ($userId) {
            $submission = ProjectSubmission::where('project_id', $project->id)
                ->where('user_id', $userId)
                ->with('evaluator:id,name,avatar')
                ->first();
        }

        return response()->json([
            'project' => $project,
            'submission' => $submission,
        ]);
    }

    /**
     * Submit real-world project (GitHub repo + Live demo + Architecture notes).
     */
    public function submit(Request $request, $id)
    {
        $request->validate([
            'github_url' => 'required|url|max:255',
            'live_demo_url' => 'nullable|url|max:255',
            'architecture_notes' => 'required|string',
        ]);

        $user = $request->user();
        $project = RealWorldProject::findOrFail($id);

        $submission = ProjectSubmission::updateOrCreate(
            ['project_id' => $project->id, 'user_id' => $user->id],
            [
                'github_url' => $request->github_url,
                'live_demo_url' => $request->live_demo_url,
                'architecture_notes' => $request->architecture_notes,
                'status' => 'submitted',
            ]
        );

        return response()->json([
            'message' => 'Project submitted successfully for instructor evaluation!',
            'submission' => $submission,
        ]);
    }

    /**
     * Get current student's project submissions.
     */
    public function mySubmissions(Request $request)
    {
        $userId = $request->user()->id;

        $submissions = ProjectSubmission::where('user_id', $userId)
            ->with(['project.course:id,title', 'evaluator:id,name,avatar'])
            ->latest()
            ->get();

        return response()->json($submissions);
    }

    /**
     * Instructor view: submissions awaiting evaluation.
     */
    public function instructorSubmissions(Request $request)
    {
        $user = $request->user();

        $submissions = ProjectSubmission::with([
            'project.course:id,title',
            'user:id,name,email,avatar',
            'evaluator:id,name,avatar'
        ])
        ->latest()
        ->get();

        return response()->json($submissions);
    }

    /**
     * Instructor evaluation & grading of real-world project.
     */
    public function grade(Request $request, $submissionId)
    {
        $request->validate([
            'score' => 'required|integer|min:0|max:100',
            'evaluation_feedback' => 'required|string',
            'status' => 'required|in:graded,revision_requested',
        ]);

        $evaluator = $request->user();
        $submission = ProjectSubmission::with('project')->findOrFail($submissionId);

        $submission->update([
            'score' => $request->score,
            'evaluation_feedback' => $request->evaluation_feedback,
            'status' => $request->status,
            'evaluator_id' => $evaluator->id,
            'evaluated_at' => now(),
        ]);

        // If passed, update student skills & check badge
        if ($request->status === 'graded' && $request->score >= $submission->project->passing_score) {
            $studentId = $submission->user_id;

            // Update skills
            if (!empty($submission->project->skills_developed)) {
                foreach ($submission->project->skills_developed as $skillName) {
                    $skill = Skill::firstOrCreate(['name' => $skillName], ['category' => 'Engineering', 'description' => $skillName . ' competency']);
                    $userSkill = UserSkill::firstOrNew(['user_id' => $studentId, 'skill_id' => $skill->id]);
                    $userSkill->proficiency_level = min(100, ($userSkill->proficiency_level ?? 30) + 20);
                    $userSkill->verified_projects_count = ($userSkill->verified_projects_count ?? 0) + 1;
                    $userSkill->status = $userSkill->proficiency_level >= 80 ? 'mastered' : 'proficient';
                    $userSkill->save();
                }
            }

            // Award "Lead: Real-World Master" badge if exists
            $leadBadge = Badge::where('code', 'lead_capstone_master')->first();
            if ($leadBadge) {
                UserBadge::firstOrCreate([
                    'user_id' => $studentId,
                    'badge_id' => $leadBadge->id,
                ], [
                    'awarded_at' => now(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Project evaluation submitted successfully!',
            'submission' => $submission->load(['user:id,name,email', 'evaluator:id,name']),
        ]);
    }
}
