<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'github_url',
        'live_demo_url',
        'architecture_notes',
        'status',
        'score',
        'evaluation_feedback',
        'evaluator_id',
        'evaluated_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'evaluated_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(RealWorldProject::class, 'project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
