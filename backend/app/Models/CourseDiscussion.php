<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseDiscussion extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'user_id',
        'lesson_id',
        'title',
        'content',
        'upvotes',
        'is_pinned',
        'is_resolved',
    ];

    protected $casts = [
        'upvotes' => 'integer',
        'is_pinned' => 'boolean',
        'is_resolved' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function replies()
    {
        return $this->hasMany(DiscussionReply::class)->with('user')->orderBy('created_at', 'asc');
    }
}
