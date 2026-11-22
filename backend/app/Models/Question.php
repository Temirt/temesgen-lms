<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_type',
        'points',
        'explanation',
        'sort_order',
    ];

    protected $casts = [
        'points' => 'integer',
        'sort_order' => 'integer',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function options()
    {
        return $this->hasMany(QuestionOption::class)->orderBy('sort_order', 'asc');
    }

    public function answers()
    {
        return $this->hasMany(QuizAnswer::class);
    }
}
