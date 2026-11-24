<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseDiscussion;
use App\Models\DiscussionReply;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    /**
     * Get discussion threads for a specific course.
     */
    public function courseDiscussions(Request $request, $courseId)
    {
        $discussions = CourseDiscussion::where('course_id', $courseId)
            ->with(['user:id,name,avatar,role,headline', 'lesson:id,title'])
            ->withCount('replies')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($discussions);
    }

    /**
     * Create a new discussion topic / question.
     */
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'lesson_id' => 'nullable|exists:lessons,id',
        ]);

        $user = $request->user();

        $discussion = CourseDiscussion::create([
            'course_id' => $courseId,
            'user_id' => $user->id,
            'lesson_id' => $request->lesson_id,
            'title' => $request->title,
            'content' => $request->content,
            'upvotes' => 0,
            'is_pinned' => false,
            'is_resolved' => false,
        ]);

        $discussion->load('user:id,name,avatar,role,headline');

        return response()->json($discussion, 201);
    }

    /**
     * Get discussion details with all replies.
     */
    public function show($id)
    {
        $discussion = CourseDiscussion::with([
            'user:id,name,avatar,role,headline',
            'course:id,title',
            'lesson:id,title',
            'replies.user:id,name,avatar,role,headline'
        ])->findOrFail($id);

        return response()->json($discussion);
    }

    /**
     * Post a reply to a discussion thread.
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $user = $request->user();
        $discussion = CourseDiscussion::findOrFail($id);

        $reply = DiscussionReply::create([
            'course_discussion_id' => $discussion->id,
            'user_id' => $user->id,
            'content' => $request->content,
            'is_instructor_endorsed' => $user->isInstructor() || $user->isAdmin(),
            'upvotes' => 0,
        ]);

        $reply->load('user:id,name,avatar,role,headline');

        return response()->json($reply, 201);
    }

    /**
     * Upvote a discussion thread.
     */
    public function upvoteDiscussion($id)
    {
        $discussion = CourseDiscussion::findOrFail($id);
        $discussion->increment('upvotes');

        return response()->json(['upvotes' => $discussion->upvotes]);
    }

    /**
     * Endorse a reply (Instructors only).
     */
    public function endorseReply(Request $request, $replyId)
    {
        $user = $request->user();
        if (!$user->isInstructor() && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reply = DiscussionReply::findOrFail($replyId);
        $reply->is_instructor_endorsed = !$reply->is_instructor_endorsed;
        $reply->save();

        return response()->json($reply);
    }
}
