<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LearningController extends Controller
{
    /**
     * Get learning interface course curriculum and player content.
     */
    public function getCourseContent(Request $request, $courseId)
    {
        $user = $request->user();
        $course = Course::with([
            'instructor:id,name,avatar,headline',
            'modules' => function ($q) {
                $q->orderBy('sort_order', 'asc')
                  ->with([
                      'lessons' => function ($lq) {
                          $lq->orderBy('sort_order', 'asc')->with('resources');
                      },
                      'quizzes',
                      'assignments'
                  ]);
            },
            'announcements' => function ($q) {
                $q->latest();
            }
        ])->findOrFail($courseId);

        // Authorization check: must be admin, course instructor, or actively enrolled student
        $isInstructor = $course->instructor_id === $user->id;
        $isAdmin = $user->isAdmin();
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if (!$isAdmin && !$isInstructor && !$enrollment) {
            return response()->json([
                'message' => 'You do not have permission to access this learning classroom. Please enroll first.',
            ], 403);
        }

        // Update enrollment last accessed
        if ($enrollment) {
            $enrollment->update(['last_accessed_at' => now()]);
        }

        // Get student's completed lessons & watch progress
        $progressRecords = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->get(['lesson_id', 'is_completed', 'last_watched_second', 'completed_at']);

        $completedLessonIds = $progressRecords->where('is_completed', true)->pluck('lesson_id')->toArray();
        $watchProgressMap = $progressRecords->keyBy('lesson_id');

        return response()->json([
            'course' => $course,
            'enrollment' => $enrollment,
            'completed_lesson_ids' => $completedLessonIds,
            'watch_progress' => $watchProgressMap,
            'is_instructor' => $isInstructor,
            'is_admin' => $isAdmin,
        ]);
    }

    /**
     * Mark a lesson as completed, calculate progress, and issue certificate if finished.
     */
    public function completeLesson(Request $request, $lessonId)
    {
        $user = $request->user();
        $lesson = Lesson::findOrFail($lessonId);
        $courseId = $lesson->course_id;

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        // Mark progress
        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            [
                'course_id' => $courseId,
                'is_completed' => true,
                'completed_at' => now(),
            ]
        );

        // Recalculate progress percentage
        $totalLessons = Lesson::where('course_id', $courseId)->count();
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->where('is_completed', true)
            ->count();

        $percentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 100.00;

        $certificateIssued = false;
        $certificate = null;

        if ($enrollment) {
            $enrollment->progress_percentage = $percentage;

            if ($percentage >= 100.00 && $enrollment->status !== 'completed') {
                $enrollment->status = 'completed';
                $enrollment->completion_date = now();

                // Automatically generate certificate
                $course = Course::with('instructor')->find($courseId);
                $certNumber = 'TLMS-' . date('Y') . '-' . strtoupper(Str::random(6));

                $certificate = Certificate::firstOrCreate(
                    ['user_id' => $user->id, 'course_id' => $courseId],
                    [
                        'certificate_number' => $certNumber,
                        'enrollment_id' => $enrollment->id,
                        'issue_date' => now()->toDateString(),
                        'instructor_name' => $course->instructor ? $course->instructor->name : 'Temesgen LMS Instructor',
                        'course_title' => $course->title,
                        'student_name' => $user->name,
                        'verification_url' => 'http://localhost:5173/verify-certificate?id=' . $certNumber,
                    ]
                );

                $certificateIssued = true;

                // Send notification
                Notification::create([
                    'user_id' => $user->id,
                    'type' => 'course_completed',
                    'title' => 'Course Completed!',
                    'message' => "Congratulations on completing {$course->title}! Your Certificate of Completion has been generated.",
                    'link' => '/student/certificates',
                ]);

                ActivityLog::log('COURSE_COMPLETE', "User {$user->name} completed {$course->title} and earned certificate {$certNumber}", $course, $user);
            }

            $enrollment->save();
        }

        return response()->json([
            'message' => 'Lesson marked as completed',
            'progress_percentage' => $percentage,
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'certificate_issued' => $certificateIssued,
            'certificate' => $certificate,
        ]);
    }

    /**
     * Update video playback position.
     */
    public function updateVideoProgress(Request $request, $lessonId)
    {
        $user = $request->user();
        $lesson = Lesson::findOrFail($lessonId);

        $validated = $request->validate([
            'seconds' => 'required|integer|min:0',
        ]);

        LessonProgress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            [
                'course_id' => $lesson->course_id,
                'last_watched_second' => $validated['seconds'],
            ]
        );

        return response()->json(['status' => 'success']);
    }
}
