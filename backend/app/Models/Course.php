<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'instructor_id',
        'category_id',
        'title',
        'slug',
        'subtitle',
        'description',
        'requirements',
        'objectives',
        'target_audience',
        'level',
        'language',
        'price',
        'is_free',
        'thumbnail',
        'promo_video_url',
        'status',
        'rejection_reason',
        'duration_hours',
        'is_featured',
    ];

    protected $casts = [
        'requirements' => 'array',
        'objectives' => 'array',
        'price' => 'decimal:2',
        'is_free' => 'boolean',
        'is_featured' => 'boolean',
        'duration_hours' => 'decimal:2',
    ];

    protected $appends = [
        'average_rating',
        'reviews_count',
        'enrollments_count',
        'total_lessons_count'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($course) {
            if (empty($course->slug)) {
                $course->slug = Str::slug($course->title) . '-' . Str::random(5);
            }
        });
    }

    // Accessors
    public function getAverageRatingAttribute(): float
    {
        return round((float) $this->reviews()->where('is_approved', true)->avg('rating') ?: 5.0, 1);
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->reviews()->where('is_approved', true)->count();
    }

    public function getEnrollmentsCountAttribute(): int
    {
        return $this->enrollments()->where('status', '!=', 'cancelled')->count();
    }

    public function getTotalLessonsCountAttribute(): int
    {
        return $this->lessons()->count();
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Relationships
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function modules()
    {
        return $this->hasMany(CourseModule::class)->orderBy('sort_order', 'asc');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order', 'asc');
    }

    public function requirementsList()
    {
        return $this->hasMany(CourseRequirement::class)->orderBy('sort_order', 'asc');
    }

    public function objectivesList()
    {
        return $this->hasMany(CourseObjective::class)->orderBy('sort_order', 'asc');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments');
    }

    public function reviews()
    {
        return $this->hasMany(CourseReview::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }
}
