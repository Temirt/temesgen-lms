<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningPathCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_path_id',
        'course_id',
        'sort_order',
        'is_milestone',
        'milestone_title',
    ];

    protected $casts = [
        'is_milestone' => 'boolean',
    ];

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
