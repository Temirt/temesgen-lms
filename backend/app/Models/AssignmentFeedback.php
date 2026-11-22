<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentFeedback extends Model
{
    use HasFactory;

    protected $table = 'assignment_feedback';

    protected $fillable = [
        'submission_id',
        'instructor_id',
        'feedback_text',
    ];

    public function submission()
    {
        return $this->belongsTo(AssignmentSubmission::class, 'submission_id');
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
