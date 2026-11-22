<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Assignment;
use App\Models\AssignmentFeedback;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    /**
     * List assignments for a course.
     */
    public function index(Request $request, $courseId)
    {
        $assignments = Assignment::where('course_id', $courseId)
            ->where('is_published', true)
            ->with('userSubmission')
            ->get();

        return response()->json($assignments);
    }

    /**
     * Show single assignment.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $assignment = Assignment::with(['course:id,title,instructor_id', 'module:id,title'])->findOrFail($id);

        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('user_id', $user->id)
            ->with('feedbacks.instructor:id,name,avatar')
            ->first();

        return response()->json([
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    /**
     * Student submits assignment.
     */
    public function submit(Request $request, $id)
    {
        $user = $request->user();
        $assignment = Assignment::with('course')->findOrFail($id);

        $request->validate([
            'submission_text' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,zip,doc,docx,txt,png,jpg|max:20480', // up to 20MB
        ]);

        if (!$request->filled('submission_text') && !$request->hasFile('file')) {
            return response()->json(['message' => 'Please provide either a text response or upload a file.'], 422);
        }

        $filePath = null;
        $fileName = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('submissions', 'public');
        }

        $status = 'submitted';
        if ($assignment->due_date && now()->greaterThan($assignment->due_date)) {
            $status = 'late';
        }

        $submission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'user_id' => $user->id],
            [
                'submission_text' => $request->input('submission_text'),
                'file_path' => $filePath,
                'file_name' => $fileName,
                'submitted_at' => now(),
                'status' => $status,
            ]
        );

        ActivityLog::log('ASSIGNMENT_SUBMIT', "User {$user->name} submitted assignment {$assignment->title}", $assignment, $user);

        // Notify instructor
        if ($assignment->course && $assignment->course->instructor_id) {
            Notification::create([
                'user_id' => $assignment->course->instructor_id,
                'type' => 'assignment_submitted',
                'title' => 'New Assignment Submission',
                'message' => "{$user->name} submitted an assignment for {$assignment->title}.",
                'link' => "/instructor/submissions",
            ]);
        }

        return response()->json([
            'message' => 'Assignment submitted successfully',
            'submission' => $submission,
        ]);
    }

    /**
     * Student view all their submissions.
     */
    public function mySubmissions(Request $request)
    {
        $user = $request->user();

        $submissions = AssignmentSubmission::with([
            'assignment.course:id,title',
            'feedbacks.instructor:id,name,avatar',
        ])
        ->where('user_id', $user->id)
        ->latest('submitted_at')
        ->get();

        return response()->json($submissions);
    }

    /**
     * Instructor view submissions for courses they teach.
     */
    public function instructorSubmissions(Request $request)
    {
        $user = $request->user();

        $courseIds = Course::where('instructor_id', $user->id)->pluck('id');
        if ($user->isAdmin()) {
            $courseIds = Course::pluck('id');
        }

        $submissions = AssignmentSubmission::with([
            'assignment:id,course_id,title,max_score,due_date',
            'assignment.course:id,title',
            'user:id,name,email,avatar',
            'feedbacks',
        ])
        ->whereHas('assignment', function ($q) use ($courseIds) {
            $q->whereIn('course_id', $courseIds);
        })
        ->latest('submitted_at')
        ->paginate(15);

        return response()->json($submissions);
    }

    /**
     * Instructor grades a submission.
     */
    public function gradeSubmission(Request $request, $submissionId)
    {
        $user = $request->user();
        $submission = AssignmentSubmission::with(['assignment.course', 'user'])->findOrFail($submissionId);

        // Authorization
        if (!$user->isAdmin() && $submission->assignment->course->instructor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to grade this submission'], 403);
        }

        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:' . $submission->assignment->max_score,
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'status' => 'graded',
            'instructor_id' => $user->id,
            'graded_at' => now(),
        ]);

        if (!empty($validated['feedback'])) {
            AssignmentFeedback::create([
                'submission_id' => $submission->id,
                'instructor_id' => $user->id,
                'feedback_text' => $validated['feedback'],
            ]);
        }

        ActivityLog::log('ASSIGNMENT_GRADE', "Instructor {$user->name} graded {$submission->user->name}'s submission ({$validated['grade']}/{$submission->assignment->max_score})", $submission->assignment, $user);

        // Notify student
        Notification::create([
            'user_id' => $submission->user_id,
            'type' => 'assignment_graded',
            'title' => 'Assignment Graded',
            'message' => "Your submission for {$submission->assignment->title} was graded: {$validated['grade']}/{$submission->assignment->max_score}.",
            'link' => '/student/assignments',
        ]);

        return response()->json([
            'message' => 'Submission graded successfully',
            'submission' => $submission->load('feedbacks'),
        ]);
    }

    /**
     * Instructor create assignment.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'module_id' => 'nullable|exists:course_modules,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'max_score' => 'required|integer|min:1',
            'due_date' => 'nullable|date',
            'attachment' => 'nullable|file|mimes:pdf,zip,doc,docx,txt|max:10240',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('assignments', 'public');
        }

        $assignment = Assignment::create([
            'course_id' => $validated['course_id'],
            'module_id' => $validated['module_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'reference_attachment' => $attachmentPath,
            'max_score' => $validated['max_score'],
            'due_date' => $validated['due_date'] ?? null,
            'is_published' => true,
        ]);

        return response()->json([
            'message' => 'Assignment created successfully',
            'assignment' => $assignment,
        ], 201);
    }
}
