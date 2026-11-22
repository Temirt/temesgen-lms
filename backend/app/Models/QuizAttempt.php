<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'attempt_number',
        'score',
        'total_points',
        'percentage',
        'is_passed',
        'status',
        'instructor_feedback',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'total_points' => 'decimal:2',
        'percentage' => 'decimal:2',
        'is_passed' => 'boolean',
        'attempt_number' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function answers()
    {
        return $this->hasMany(QuizAnswer::class, 'attempt_id');
    }
}
