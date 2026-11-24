<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseDiscussion;
use App\Models\DirectMessage;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\Notification;
use App\Models\ProjectSubmission;
use App\Models\Quiz;
use App\Models\RealWorldProject;
use App\Models\StudyGroupMember;
use App\Models\UserBadge;
use App\Models\UserLearningPath;
use App\Models\UserSkill;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Student dashboard overview statistics and quick actions organized around the 3 L's framework.
     */
    public function dashboardStats(Request $request)
    {
        $user = $request->user();

        // 1. LEARN METRICS
        $enrolledCount = Enrollment::where('user_id', $user->id)->where('status', '!=', 'cancelled')->count();
        $completedCount = Enrollment::where('user_id', $user->id)->where('status', 'completed')->count();
        $enrolledPathsCount = UserLearningPath::where('user_id', $user->id)->count();

        $completedLessonIds = LessonProgress::where('user_id', $user->id)->where('is_completed', true)->pluck('lesson_id');
        $totalMinutes = \App\Models\Lesson::whereIn('id', $completedLessonIds)->sum('duration_minutes');
        $learningHours = round($totalMinutes / 60, 1);

        // 2. LINK METRICS
        $unreadMessagesCount = DirectMessage::where('recipient_id', $user->id)->where('is_read', false)->count();
        $studyGroupsCount = StudyGroupMember::where('user_id', $user->id)->count();
        $discussionsCount = CourseDiscussion::where('user_id', $user->id)->count();

        // 3. LEAD METRICS
        $certificatesCount = Certificate::where('user_id', $user->id)->count();
        $projectsSubmittedCount = ProjectSubmission::where('user_id', $user->id)->count();
        $projectsGradedCount = ProjectSubmission::where('user_id', $user->id)->where('status', 'graded')->count();
        $badgesEarnedCount = UserBadge::where('user_id', $user->id)->count();
        $skillsCount = UserSkill::where('user_id', $user->id)->count();

        // Continue Learning courses
        $continueLearning = Enrollment::with([
            'course' => function ($q) {
                $q->with(['instructor:id,name,avatar', 'category:id,name'])
                  ->withCount('lessons');
            }
        ])
        ->where('user_id', $user->id)
        ->where('status', 'active')
        ->latest('last_accessed_at')
        ->take(4)
        ->get();

        // Upcoming assignments
        $enrolledCourseIds = Enrollment::where('user_id', $user->id)->pluck('course_id');
        $upcomingAssignments = Assignment::with('course:id,title')
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_published', true)
            ->whereDoesntHave('submissions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest('due_date')
            ->take(3)
            ->get();

        // Real-world projects available in enrolled courses
        $leadProjects = RealWorldProject::with(['course:id,title', 'instructor:id,name,avatar'])
            ->whereIn('course_id', $enrolledCourseIds)
            ->take(3)
            ->get();

        // Notifications
        $recentNotifications = Notification::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Recommended courses
        $recommendedCourses = Course::published()
            ->whereNotIn('id', $enrolledCourseIds)
            ->with(['instructor:id,name,avatar', 'category:id,name'])
            ->take(3)
            ->get();

        // User top skills
        $topSkills = UserSkill::where('user_id', $user->id)
            ->with('skill')
            ->orderBy('proficiency_level', 'desc')
            ->take(5)
            ->get();

        // Recent badges
        $recentBadges = UserBadge::where('user_id', $user->id)
            ->with('badge')
            ->latest('awarded_at')
            ->take(4)
            ->get();

        return response()->json([
            'stats' => [
                'enrolled_courses' => $enrolledCount,
                'completed_courses' => $completedCount,
                'learning_hours' => $learningHours,
                'certificates_earned' => $certificatesCount,
                // 3 L's breakdown
                'three_ls' => [
                    'learn' => [
                        'enrolled_courses' => $enrolledCount,
                        'completed_courses' => $completedCount,
                        'learning_hours' => $learningHours,
                        'learning_paths' => $enrolledPathsCount,
                        'completed_lessons' => $completedLessonIds->count(),
                    ],
                    'link' => [
                        'unread_messages' => $unreadMessagesCount,
                        'study_groups' => $studyGroupsCount,
                        'discussions' => $discussionsCount,
                    ],
                    'lead' => [
                        'projects_submitted' => $projectsSubmittedCount,
                        'projects_graded' => $projectsGradedCount,
                        'badges_earned' => $badgesEarnedCount,
                        'skills_tracked' => $skillsCount,
                        'certificates' => $certificatesCount,
                    ],
                ],
            ],
            'continue_learning' => $continueLearning,
            'upcoming_assignments' => $upcomingAssignments,
            'lead_projects' => $leadProjects,
            'recent_notifications' => $recentNotifications,
            'recommended_courses' => $recommendedCourses,
            'top_skills' => $topSkills,
            'recent_badges' => $recentBadges,
        ]);
    }
}
