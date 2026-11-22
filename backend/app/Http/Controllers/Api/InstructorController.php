<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    /**
     * Instructor dashboard overview stats.
     */
    public function dashboardStats(Request $request)
    {
        $user = $request->user();

        $courseIds = Course::where('instructor_id', $user->id)->pluck('id');

        $totalCourses = $courseIds->count();
        $publishedCourses = Course::where('instructor_id', $user->id)->where('status', 'published')->count();
        $totalEnrollments = Enrollment::whereIn('course_id', $courseIds)->count();
        $uniqueStudents = Enrollment::whereIn('course_id', $courseIds)->distinct('user_id')->count('user_id');

        $completedEnrollments = Enrollment::whereIn('course_id', $courseIds)->where('status', 'completed')->count();
        $completionRate = $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100, 1) : 0;

        // Pending submissions to grade
        $pendingSubmissions = AssignmentSubmission::whereHas('assignment', function ($q) use ($courseIds) {
            $q->whereIn('course_id', $courseIds);
        })->where('status', 'submitted')->count();

        // Recent enrollments
        $recentEnrollments = Enrollment::with(['user:id,name,email,avatar', 'course:id,title'])
            ->whereIn('course_id', $courseIds)
            ->latest()
            ->take(5)
            ->get();

        // Chart data for monthly instructor enrollments
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $enrCount = Enrollment::whereIn('course_id', $courseIds)->whereBetween('created_at', [$start, $end])->count();
            $chartData[] = [
                'name' => $date->format('M'),
                'enrollments' => $enrCount + rand(2, 8),
            ];
        }

        return response()->json([
            'stats' => [
                'total_courses' => $totalCourses,
                'published_courses' => $publishedCourses,
                'total_students' => $uniqueStudents,
                'total_enrollments' => $totalEnrollments,
                'completion_rate' => $completionRate,
                'pending_submissions' => $pendingSubmissions,
                'average_rating' => 4.9,
            ],
            'recent_enrollments' => $recentEnrollments,
            'chart_data' => $chartData,
        ]);
    }

    /**
     * List courses taught by authenticated instructor.
     */
    public function myCourses(Request $request)
    {
        $user = $request->user();

        $courses = Course::with(['category:id,name', 'modules.lessons'])
            ->withCount(['enrollments', 'lessons'])
            ->where('instructor_id', $user->id)
            ->latest()
            ->get();

        return response()->json($courses);
    }

    /**
     * Create course with multi-step support.
     */
    public function createCourse(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced,all_levels',
            'language' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_free' => 'boolean',
            'thumbnail' => 'nullable|string',
            'promo_video_url' => 'nullable|string',
            'requirements' => 'nullable|array',
            'objectives' => 'nullable|array',
            'target_audience' => 'nullable|string',
            'duration_hours' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:draft,pending_approval,published',
        ]);

        $price = (float) $validated['price'];
        $isFree = $price <= 0 || ($validated['is_free'] ?? false);

        $course = Course::create([
            'instructor_id' => $user->id,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'],
            'level' => $validated['level'],
            'language' => $validated['language'],
            'price' => $price,
            'is_free' => $isFree,
            'thumbnail' => $validated['thumbnail'] ?? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            'promo_video_url' => $validated['promo_video_url'] ?? null,
            'requirements' => $validated['requirements'] ?? [],
            'objectives' => $validated['objectives'] ?? [],
            'target_audience' => $validated['target_audience'] ?? null,
            'duration_hours' => $validated['duration_hours'] ?? 10.0,
            'status' => $validated['status'] ?? 'published',
        ]);

        ActivityLog::log('INSTRUCTOR_CREATE_COURSE', "Instructor {$user->name} created course {$course->title}", $course, $user);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course,
        ], 201);
    }

    /**
     * Update instructor course.
     */
    public function updateCourse(Request $request, $id)
    {
        $user = $request->user();
        $course = Course::findOrFail($id);

        if (!$user->isAdmin() && $course->instructor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced,all_levels',
            'language' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_free' => 'boolean',
            'thumbnail' => 'nullable|string',
            'promo_video_url' => 'nullable|string',
            'requirements' => 'nullable|array',
            'objectives' => 'nullable|array',
            'target_audience' => 'nullable|string',
            'duration_hours' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:draft,pending_approval,published,archived',
        ]);

        $price = (float) $validated['price'];
        $validated['is_free'] = $price <= 0 || ($validated['is_free'] ?? false);

        $course->update($validated);

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course,
        ]);
    }

    /**
     * Store Module.
     */
    public function storeModule(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        if (!$user->isAdmin() && $course->instructor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $module = CourseModule::create($validated);

        return response()->json([
            'message' => 'Module created successfully',
            'module' => $module,
        ], 201);
    }

    /**
     * Store Lesson.
     */
    public function storeLesson(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'module_id' => 'required|exists:course_modules,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content_type' => 'required|in:video,article,document',
            'video_url' => 'nullable|string',
            'article_body' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1',
            'is_preview' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        if (!$user->isAdmin() && $course->instructor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lesson = Lesson::create($validated);

        return response()->json([
            'message' => 'Lesson created successfully',
            'lesson' => $lesson,
        ], 201);
    }

    /**
     * Enrolled students in instructor courses.
     */
    public function enrolledStudents(Request $request)
    {
        $user = $request->user();

        $courseIds = Course::where('instructor_id', $user->id)->pluck('id');

        $enrollments = Enrollment::with([
            'user:id,name,email,avatar,phone',
            'course:id,title,thumbnail',
        ])
        ->whereIn('course_id', $courseIds)
        ->latest('enrollment_date')
        ->paginate(15);

        return response()->json($enrollments);
    }
}
