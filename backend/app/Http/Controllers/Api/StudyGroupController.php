<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudyGroup;
use App\Models\StudyGroupMember;
use App\Models\StudyGroupMessage;
use Illuminate\Http\Request;

class StudyGroupController extends Controller
{
    /**
     * List all study groups, optionally filtered by course.
     */
    public function index(Request $request)
    {
        $userId = $request->user()?->id;
        $courseId = $request->query('course_id');

        $query = StudyGroup::with([
            'course:id,title,thumbnail',
            'creator:id,name,avatar',
            'members.user:id,name,avatar,role'
        ])
        ->withCount('members');

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        $groups = $query->latest()->get()->map(function ($group) use ($userId) {
            $isMember = false;
            $userRole = null;
            if ($userId) {
                $member = $group->members->firstWhere('user_id', $userId);
                if ($member) {
                    $isMember = true;
                    $userRole = $member->role;
                }
            }

            return [
                'id' => $group->id,
                'name' => $group->name,
                'description' => $group->description,
                'topic' => $group->topic,
                'meeting_schedule' => $group->meeting_schedule,
                'max_members' => $group->max_members,
                'is_private' => $group->is_private,
                'members_count' => $group->members_count,
                'course' => $group->course,
                'creator' => $group->creator,
                'is_member' => $isMember,
                'my_role' => $userRole,
                'created_at' => $group->created_at,
            ];
        });

        return response()->json($groups);
    }

    /**
     * Get study groups for authenticated user.
     */
    public function myGroups(Request $request)
    {
        $userId = $request->user()->id;

        $groups = StudyGroup::whereHas('members', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['course:id,title,thumbnail', 'members.user:id,name,avatar'])
        ->withCount('members')
        ->get();

        return response()->json($groups);
    }

    /**
     * Create a new student study group.
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'topic' => 'required|string|max:200',
            'meeting_schedule' => 'nullable|string|max:100',
            'max_members' => 'nullable|integer|min:2|max:30',
        ]);

        $user = $request->user();

        $group = StudyGroup::create([
            'course_id' => $request->course_id,
            'creator_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'topic' => $request->topic,
            'meeting_schedule' => $request->meeting_schedule ?? 'Weekly peer meetups',
            'max_members' => $request->max_members ?? 10,
            'is_private' => false,
        ]);

        // Add creator as leader
        StudyGroupMember::create([
            'study_group_id' => $group->id,
            'user_id' => $user->id,
            'role' => 'leader',
            'joined_at' => now(),
        ]);

        $group->load(['course:id,title', 'creator:id,name,avatar', 'members.user:id,name,avatar']);

        return response()->json($group, 201);
    }

    /**
     * Join a study group.
     */
    public function join(Request $request, $id)
    {
        $user = $request->user();
        $group = StudyGroup::withCount('members')->findOrFail($id);

        if ($group->members_count >= $group->max_members) {
            return response()->json(['message' => 'Study group is at capacity.'], 422);
        }

        $existing = StudyGroupMember::where('study_group_id', $group->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already a member.'], 200);
        }

        StudyGroupMember::create([
            'study_group_id' => $group->id,
            'user_id' => $user->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return response()->json(['message' => 'Joined study group successfully.']);
    }

    /**
     * Leave a study group.
     */
    public function leave(Request $request, $id)
    {
        $user = $request->user();
        StudyGroupMember::where('study_group_id', $id)
            ->where('user_id', $user->id)
            ->delete();

        return response()->json(['message' => 'Left study group.']);
    }

    /**
     * Get messages in a study group.
     */
    public function messages($id)
    {
        $group = StudyGroup::with(['course:id,title', 'members.user:id,name,avatar,role'])->findOrFail($id);
        $messages = StudyGroupMessage::where('study_group_id', $id)
            ->with('user:id,name,avatar,role')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'group' => $group,
            'messages' => $messages,
        ]);
    }

    /**
     * Post a collaborative message in study group.
     */
    public function postMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        $group = StudyGroup::findOrFail($id);

        $msg = StudyGroupMessage::create([
            'study_group_id' => $group->id,
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        $msg->load('user:id,name,avatar,role');

        return response()->json($msg, 201);
    }
}
