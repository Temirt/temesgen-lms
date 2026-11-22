<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'description',
        'reference_attachment',
        'max_score',
        'due_date',
        'is_published',
    ];

    protected $casts = [
        'max_score' => 'integer',
        'due_date' => 'datetime',
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

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function userSubmission()
    {
        return $this->hasOne(AssignmentSubmission::class)->where('user_id', auth()->id());
    }
}
