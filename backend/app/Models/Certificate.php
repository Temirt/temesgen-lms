<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'user_id',
        'course_id',
        'enrollment_id',
        'issue_date',
        'instructor_name',
        'course_title',
        'student_name',
        'qr_code_path',
        'pdf_path',
        'verification_url',
    ];

    protected $casts = [
        'issue_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
