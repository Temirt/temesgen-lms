<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * List all conversation contacts for the current user.
     */
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        // Find all distinct users we have exchanged messages with
        $contactIds = DirectMessage::where('sender_id', $userId)
            ->pluck('recipient_id')
            ->merge(
                DirectMessage::where('recipient_id', $userId)->pluck('sender_id')
            )
            ->unique();

        $contacts = User::whereIn('id', $contactIds)
            ->select('id', 'name', 'email', 'avatar', 'role', 'headline')
            ->get()
            ->map(function ($contact) use ($userId) {
                // Get latest message
                $latest = DirectMessage::where(function ($q) use ($userId, $contact) {
                    $q->where('sender_id', $userId)->where('recipient_id', $contact->id);
                })->orWhere(function ($q) use ($userId, $contact) {
                    $q->where('sender_id', $contact->id)->where('recipient_id', $userId);
                })
                ->latest()
                ->first();

                // Get unread count from this contact
                $unread = DirectMessage::where('sender_id', $contact->id)
                    ->where('recipient_id', $userId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'contact' => $contact,
                    'latest_message' => $latest ? [
                        'id' => $latest->id,
                        'message' => $latest->message,
                        'created_at' => $latest->created_at,
                        'is_mine' => $latest->sender_id === $userId,
                    ] : null,
                    'unread_count' => $unread,
                ];
            })
            ->sortByDesc(function ($item) {
                return $item['latest_message']['created_at'] ?? '1970-01-01';
            })
            ->values();

        // Also suggest instructors if student has no contacts yet
        if ($contacts->isEmpty()) {
            $suggested = User::where('role', 'instructor')
                ->where('id', '!=', $userId)
                ->limit(3)
                ->get()
                ->map(function ($inst) {
                    return [
                        'contact' => $inst,
                        'latest_message' => null,
                        'unread_count' => 0,
                    ];
                });
            return response()->json($suggested);
        }

        return response()->json($contacts);
    }

    /**
     * Get message history with a specific contact.
     */
    public function thread(Request $request, $contactId)
    {
        $userId = $request->user()->id;

        // Mark incoming messages as read
        DirectMessage::where('sender_id', $contactId)
            ->where('recipient_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        $messages = DirectMessage::where(function ($q) use ($userId, $contactId) {
            $q->where('sender_id', $userId)->where('recipient_id', $contactId);
        })->orWhere(function ($q) use ($userId, $contactId) {
            $q->where('sender_id', $contactId)->where('recipient_id', $userId);
        })
        ->with(['sender:id,name,avatar,role', 'recipient:id,name,avatar,role'])
        ->orderBy('created_at', 'asc')
        ->get();

        $contact = User::select('id', 'name', 'email', 'avatar', 'role', 'headline')->findOrFail($contactId);

        return response()->json([
            'contact' => $contact,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a new message to a contact.
     */
    public function send(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'message' => 'required|string|max:2000',
            'course_id' => 'nullable|exists:courses,id',
            'subject' => 'nullable|string|max:255',
        ]);

        $sender = $request->user();

        $msg = DirectMessage::create([
            'sender_id' => $sender->id,
            'recipient_id' => $request->recipient_id,
            'course_id' => $request->course_id,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_read' => false,
        ]);

        $msg->load(['sender:id,name,avatar,role', 'recipient:id,name,avatar,role']);

        return response()->json($msg, 201);
    }
}
