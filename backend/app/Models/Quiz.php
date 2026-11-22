<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'lesson_id',
        'title',
        'description',
        'duration_minutes',
        'passing_score',
        'max_attempts',
        'randomize_questions',
        'is_published',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'passing_score' => 'integer',
        'max_attempts' => 'integer',
        'randomize_questions' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('sort_order', 'asc');
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function userAttempts()
    {
        return $this->hasMany(QuizAttempt::class)->where('user_id', auth()->id());
    }
}
