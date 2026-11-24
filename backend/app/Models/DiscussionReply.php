<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscussionReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_discussion_id',
        'user_id',
        'content',
        'is_instructor_endorsed',
        'upvotes',
    ];

    protected $casts = [
        'is_instructor_endorsed' => 'boolean',
        'upvotes' => 'integer',
    ];

    public function discussion()
    {
        return $this->belongsTo(CourseDiscussion::class, 'course_discussion_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
