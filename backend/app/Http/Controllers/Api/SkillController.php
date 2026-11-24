<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\UserSkill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Get user skills and platform skill taxonomy.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $allSkills = Skill::all();
        $userSkills = UserSkill::where('user_id', $userId)->get()->keyBy('skill_id');

        $result = $allSkills->map(function ($skill) use ($userSkills) {
            $userSkill = $userSkills->get($skill->id);

            return [
                'id' => $skill->id,
                'name' => $skill->name,
                'category' => $skill->category,
                'icon' => $skill->icon,
                'description' => $skill->description,
                'proficiency_level' => $userSkill ? $userSkill->proficiency_level : 15,
                'status' => $userSkill ? $userSkill->status : 'developing',
                'verified_projects_count' => $userSkill ? $userSkill->verified_projects_count : 0,
            ];
        });

        // Group by category
        $byCategory = $result->groupBy('category');

        return response()->json([
            'skills' => $result,
            'by_category' => $byCategory,
            'average_proficiency' => round($result->avg('proficiency_level')),
            'mastered_count' => $result->where('status', 'mastered')->count(),
            'proficient_count' => $result->where('status', 'proficient')->count(),
            'developing_count' => $result->where('status', 'developing')->count(),
        ]);
    }
}
