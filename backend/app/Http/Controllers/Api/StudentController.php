<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\Notification;
use App\Models\Quiz;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Student dashboard overview statistics and quick actions.
     */
    public function dashboardStats(Request $request)
    {
        $user = $request->user();

        $enrolledCount = Enrollment::where('user_id', $user->id)->where('status', '!=', 'cancelled')->count();
        $completedCount = Enrollment::where('user_id', $user->id)->where('status', 'completed')->count();
        $certificatesCount = Certificate::where('user_id', $user->id)->count();

        // Learning hours: calculate from completed lessons
        $completedLessonIds = LessonProgress::where('user_id', $user->id)->where('is_completed', true)->pluck('lesson_id');
        $totalMinutes = \App\Models\Lesson::whereIn('id', $completedLessonIds)->sum('duration_minutes');
        $learningHours = round($totalMinutes / 60, 1);

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

        // Upcoming assignments from enrolled courses
        $enrolledCourseIds = Enrollment::where('user_id', $user->id)->pluck('course_id');
        $upcomingAssignments = Assignment::with('course:id,title')
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_published', true)
            ->whereDoesntHave('submissions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest('due_date')
            ->take(4)
            ->get();

        // Available quizzes
        $upcomingQuizzes = Quiz::with('course:id,title')
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_published', true)
            ->take(4)
            ->get();

        // Recent notifications
        $recentNotifications = Notification::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Recommended courses (not enrolled yet)
        $recommendedCourses = Course::published()
            ->whereNotIn('id', $enrolledCourseIds)
            ->with(['instructor:id,name,avatar', 'category:id,name'])
            ->take(3)
            ->get();

        return response()->json([
            'stats' => [
                'enrolled_courses' => $enrolledCount,
                'completed_courses' => $completedCount,
                'learning_hours' => $learningHours,
                'certificates_earned' => $certificatesCount,
            ],
            'continue_learning' => $continueLearning,
            'upcoming_assignments' => $upcomingAssignments,
            'upcoming_quizzes' => $upcomingQuizzes,
            'recent_notifications' => $recentNotifications,
            'recommended_courses' => $recommendedCourses,
        ]);
    }
}
