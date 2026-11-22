<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrollment_date',
        'status',
        'completion_date',
        'progress_percentage',
        'last_accessed_at',
        'unique_enrollment_token',
    ];

    protected $casts = [
        'enrollment_date' => 'datetime',
        'completion_date' => 'datetime',
        'last_accessed_at' => 'datetime',
        'progress_percentage' => 'decimal:2',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($enrollment) {
            if (empty($enrollment->unique_enrollment_token)) {
                $enrollment->unique_enrollment_token = 'ENR-' . strtoupper(Str::random(12));
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class);
    }
}
