<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\UserBadge;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    /**
     * Get all badges with user earned status, grouped by the 3 L's principles.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $userBadges = UserBadge::where('user_id', $userId)->get()->keyBy('badge_id');

        $badges = Badge::all()->map(function ($badge) use ($userBadges) {
            $userBadge = $userBadges->get($badge->id);

            return [
                'id' => $badge->id,
                'code' => $badge->code,
                'name' => $badge->name,
                'principle' => $badge->principle, // learn, link, lead
                'description' => $badge->description,
                'icon' => $badge->icon,
                'color' => $badge->color,
                'criteria' => $badge->criteria,
                'is_earned' => $userBadge !== null,
                'awarded_at' => $userBadge ? $userBadge->awarded_at : null,
            ];
        });

        return response()->json([
            'all' => $badges,
            'learn' => $badges->where('principle', 'learn')->values(),
            'link' => $badges->where('principle', 'link')->values(),
            'lead' => $badges->where('principle', 'lead')->values(),
            'total_badges' => $badges->count(),
            'earned_count' => $badges->where('is_earned', true)->count(),
        ]);
    }
}
