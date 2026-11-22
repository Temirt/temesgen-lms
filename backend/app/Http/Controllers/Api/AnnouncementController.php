<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Course;
use App\Models\Notification;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Get announcements (optional course_id filter).
     */
    public function index(Request $request)
    {
        $query = Announcement::with(['instructor:id,name,avatar', 'course:id,title']);

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->input('course_id'));
        }

        $announcements = $query->orderBy('is_pinned', 'desc')->latest()->paginate(15);

        return response()->json($announcements);
    }

    /**
     * Create announcement (Instructor / Admin).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_pinned' => 'boolean',
        ]);

        $announcement = Announcement::create([
            'course_id' => $validated['course_id'] ?? null,
            'instructor_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_pinned' => $validated['is_pinned'] ?? false,
        ]);

        // If course announcement, notify all enrolled students
        if (!empty($validated['course_id'])) {
            $course = Course::with('enrollments')->find($validated['course_id']);
            if ($course) {
                foreach ($course->enrollments as $enrollment) {
                    Notification::create([
                        'user_id' => $enrollment->user_id,
                        'type' => 'announcement',
                        'title' => 'New Course Announcement',
                        'message' => "{$user->name} posted: {$announcement->title}",
                        'link' => "/courses/{$course->slug}",
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Announcement posted successfully',
            'announcement' => $announcement->load(['instructor:id,name,avatar', 'course:id,title']),
        ], 201);
    }
}
