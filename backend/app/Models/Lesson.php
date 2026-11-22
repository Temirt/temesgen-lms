<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'slug',
        'description',
        'content_type',
        'video_url',
        'video_storage_path',
        'article_body',
        'duration_minutes',
        'is_preview',
        'sort_order',
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'duration_minutes' => 'integer',
        'sort_order' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($lesson) {
            if (empty($lesson->slug)) {
                $lesson->slug = Str::slug($lesson->title) . '-' . Str::random(4);
            }
        });
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function resources()
    {
        return $this->hasMany(LessonResource::class);
    }

    public function progress()
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function userProgress()
    {
        return $this->hasOne(LessonProgress::class)->where('user_id', auth()->id());
    }
}
