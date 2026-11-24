<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'creator_id',
        'name',
        'description',
        'topic',
        'meeting_schedule',
        'max_members',
        'is_private',
    ];

    protected $casts = [
        'max_members' => 'integer',
        'is_private' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->hasMany(StudyGroupMember::class)->with('user');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'study_group_members')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(StudyGroupMessage::class)->with('user')->orderBy('created_at', 'asc');
    }
}
