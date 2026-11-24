<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LearningPath;
use App\Models\UserLearningPath;
use Illuminate\Http\Request;

class LearningPathController extends Controller
{
    /**
     * Display a listing of personalized learning paths.
     */
    public function index(Request $request)
    {
        $userId = $request->user()?->id;

        $paths = LearningPath::with(['courses' => function ($q) {
            $q->select('courses.id', 'courses.title', 'courses.slug', 'courses.level', 'courses.thumbnail', 'courses.duration_hours');
        }])
        ->where('is_active', true)
        ->get()
        ->map(function ($path) use ($userId) {
            $userProgress = null;
            if ($userId) {
                $userProgress = UserLearningPath::where('user_id', $userId)
                    ->where('learning_path_id', $path->id)
                    ->first();
            }

            return [
                'id' => $path->id,
                'title' => $path->title,
                'slug' => $path->slug,
                'description' => $path->description,
                'level' => $path->level,
                'icon' => $path->icon,
                'color' => $path->color,
                'estimated_weeks' => $path->estimated_weeks,
                'career_role' => $path->career_role,
                'outcomes' => $path->outcomes,
                'courses_count' => $path->courses->count(),
                'courses' => $path->courses,
                'is_enrolled' => $userProgress !== null,
                'progress_percentage' => $userProgress ? (float) $userProgress->progress_percentage : 0,
                'status' => $userProgress ? $userProgress->status : 'unregistered',
            ];
        });

        return response()->json($paths);
    }

    /**
     * Display the specified learning path.
     */
    public function show(Request $request, $id)
    {
        $userId = $request->user()?->id;

        $path = LearningPath::with(['courses.instructor', 'courses.category'])
            ->where('is_active', true)
            ->findOrFail($id);

        $userProgress = null;
        if ($userId) {
            $userProgress = UserLearningPath::where('user_id', $userId)
                ->where('learning_path_id', $path->id)
                ->first();
        }

        return response()->json([
            'id' => $path->id,
            'title' => $path->title,
            'slug' => $path->slug,
            'description' => $path->description,
            'level' => $path->level,
            'icon' => $path->icon,
            'color' => $path->color,
            'estimated_weeks' => $path->estimated_weeks,
            'career_role' => $path->career_role,
            'outcomes' => $path->outcomes,
            'courses' => $path->courses,
            'is_enrolled' => $userProgress !== null,
            'progress_percentage' => $userProgress ? (float) $userProgress->progress_percentage : 0,
            'status' => $userProgress ? $userProgress->status : 'unregistered',
        ]);
    }

    /**
     * Enroll in a personalized learning path.
     */
    public function enroll(Request $request, $id)
    {
        $user = $request->user();
        $path = LearningPath::findOrFail($id);

        $enrollment = UserLearningPath::firstOrCreate(
            ['user_id' => $user->id, 'learning_path_id' => $path->id],
            [
                'progress_percentage' => 0,
                'status' => 'in_progress',
                'started_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Successfully enrolled in ' . $path->title,
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Get learning paths for the authenticated student.
     */
    public function myPaths(Request $request)
    {
        $user = $request->user();

        $enrolled = UserLearningPath::where('user_id', $user->id)
            ->with(['learningPath.courses'])
            ->get()
            ->map(function ($ulp) {
                return [
                    'id' => $ulp->learningPath->id,
                    'title' => $ulp->learningPath->title,
                    'description' => $ulp->learningPath->description,
                    'icon' => $ulp->learningPath->icon,
                    'color' => $ulp->learningPath->color,
                    'career_role' => $ulp->learningPath->career_role,
                    'progress_percentage' => (float) $ulp->progress_percentage,
                    'status' => $ulp->status,
                    'started_at' => $ulp->started_at,
                    'courses_count' => $ulp->learningPath->courses->count(),
                    'courses' => $ulp->learningPath->courses,
                ];
            });

        return response()->json($enrolled);
    }
}
