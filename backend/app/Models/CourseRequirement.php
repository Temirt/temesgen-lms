<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'requirement',
        'sort_order',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
