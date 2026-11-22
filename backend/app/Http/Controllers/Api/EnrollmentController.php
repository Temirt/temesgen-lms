<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EnrollmentController extends Controller
{
    /**
     * Enroll authenticated student into a course.
     */
    public function enroll(Request $request, $courseId)
    {
        $user = $request->user();
        $course = Course::findOrFail($courseId);

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing && $existing->status !== 'cancelled') {
            return response()->json([
                'message' => 'You are already enrolled in this course',
                'enrollment' => $existing,
            ]);
        }

        // Paid courses must be enrolled via payment verification
        if (!$course->is_free && $course->price > 0) {
            return response()->json([
                'message' => 'This is a paid course. Please complete payment to enroll.',
                'requires_payment' => true,
                'course' => $course,
            ], 402);
        }

        // Free course enrollment
        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'enrollment_date' => now(),
            'status' => 'active',
            'progress_percentage' => 0.00,
            'last_accessed_at' => now(),
            'unique_enrollment_token' => 'ENR-' . strtoupper(Str::random(12)),
        ]);

        ActivityLog::log('COURSE_ENROLL', "User {$user->name} enrolled in {$course->title} (Free)", $course, $user);

        // Notify student
        Notification::create([
            'user_id' => $user->id,
            'type' => 'enrollment_success',
            'title' => 'Enrolled Successfully!',
            'message' => "Welcome to {$course->title}! You can now start learning right away.",
            'link' => "/learn/{$course->id}",
        ]);

        return response()->json([
            'message' => 'Enrolled successfully',
            'enrollment' => $enrollment,
        ], 201);
    }

    /**
     * Get all enrolled courses for authenticated student.
     */
    public function myEnrollments(Request $request)
    {
        $user = $request->user();

        $enrollments = Enrollment::with([
            'course' => function ($q) {
                $q->with(['instructor:id,name,avatar', 'category:id,name,slug'])
                  ->withCount('lessons');
            }
        ])
        ->where('user_id', $user->id)
        ->where('status', '!=', 'cancelled')
        ->latest('last_accessed_at')
        ->get();

        return response()->json($enrollments);
    }

    /**
     * Check enrollment status for a specific course.
     */
    public function checkEnrollment(Request $request, $courseId)
    {
        $user = $request->user();

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->where('status', '!=', 'cancelled')
            ->first();

        return response()->json([
            'is_enrolled' => (bool) $enrollment,
            'enrollment' => $enrollment,
        ]);
    }
}
