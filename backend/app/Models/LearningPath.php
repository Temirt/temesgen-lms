<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningPath extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'level',
        'icon',
        'color',
        'estimated_weeks',
        'career_role',
        'outcomes',
        'is_active',
    ];

    protected $casts = [
        'outcomes' => 'array',
        'is_active' => 'boolean',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'learning_path_courses')
            ->withPivot(['sort_order', 'is_milestone', 'milestone_title'])
            ->orderBy('learning_path_courses.sort_order');
    }

    public function userLearningPaths()
    {
        return $this->hasMany(UserLearningPath::class);
    }

    public function enrolledUsers()
    {
        return $this->belongsToMany(User::class, 'user_learning_paths')
            ->withPivot(['progress_percentage', 'status', 'started_at', 'completed_at'])
            ->withTimestamps();
    }
}
