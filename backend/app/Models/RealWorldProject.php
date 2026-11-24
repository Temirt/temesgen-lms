<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealWorldProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'instructor_id',
        'title',
        'description',
        'scenario',
        'requirements',
        'deliverables',
        'skills_developed',
        'difficulty',
        'estimated_hours',
        'max_score',
        'passing_score',
    ];

    protected $casts = [
        'requirements' => 'array',
        'deliverables' => 'array',
        'skills_developed' => 'array',
        'estimated_hours' => 'integer',
        'max_score' => 'integer',
        'passing_score' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function submissions()
    {
        return $this->hasMany(ProjectSubmission::class, 'project_id');
    }
}
