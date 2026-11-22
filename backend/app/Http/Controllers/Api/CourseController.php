<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseReview;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of published courses with searching, filtering and sorting.
     */
    public function index(Request $request)
    {
        $query = Course::published()->with(['instructor:id,name,avatar,headline', 'category:id,name,slug']);

        // Search title, subtitle, description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('subtitle', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category slug
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Filter by price (free, paid)
        if ($request->filled('price')) {
            $priceType = $request->input('price');
            if ($priceType === 'free') {
                $query->where('is_free', true);
            } elseif ($priceType === 'paid') {
                $query->where('is_free', false);
            }
        }

        // Filter by level
        if ($request->filled('level') && $request->input('level') !== 'all') {
            $query->where('level', $request->input('level'));
        }

        // Filter by instructor
        if ($request->filled('instructor_id')) {
            $query->where('instructor_id', $request->input('instructor_id'));
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->withCount('enrollments')->orderBy('enrollments_count', 'desc');
                break;
            case 'title_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $perPage = $request->input('per_page', 9);
        $courses = $query->paginate($perPage);

        return response()->json($courses);
    }

    /**
     * Get featured courses for homepage.
     */
    public function featured()
    {
        $courses = Course::published()
            ->featured()
            ->with(['instructor:id,name,avatar,headline', 'category:id,name,slug'])
            ->take(6)
            ->get();

        return response()->json($courses);
    }

    /**
     * Get all active categories with courses count.
     */
    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->withCount(['courses' => function ($q) {
                $q->where('status', 'published');
            }])
            ->get();

        return response()->json($categories);
    }

    /**
     * Get detailed public course information.
     */
    public function show(Request $request, $slugOrId)
    {
        $course = Course::with([
            'instructor:id,name,avatar,headline,bio',
            'category:id,name,slug',
            'modules.lessons' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            },
            'quizzes.questions.options',
            'assignments',
            'reviews.user:id,name,avatar',
        ])
        ->where('slug', $slugOrId)
        ->orWhere('id', $slugOrId)
        ->firstOrFail();

        // Check if currently authenticated user is enrolled
        $isEnrolled = false;
        $enrollment = null;
        if (auth('sanctum')->check()) {
            $user = auth('sanctum')->user();
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->where('status', '!=', 'cancelled')
                ->first();
            $isEnrolled = (bool) $enrollment;
        }

        return response()->json([
            'course' => $course,
            'is_enrolled' => $isEnrolled,
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Submit course review.
     */
    public function addReview(Request $request, $id)
    {
        $user = $request->user();
        $course = Course::findOrFail($id);

        // Verify enrollment
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if (!$isEnrolled && !$user->isAdmin()) {
            return response()->json(['message' => 'You must be enrolled in this course to leave a review.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|min:5|max:1000',
        ]);

        $review = CourseReview::updateOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['rating' => $validated['rating'], 'review' => $validated['review'], 'is_approved' => true]
        );

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review->load('user:id,name,avatar'),
        ]);
    }
}
