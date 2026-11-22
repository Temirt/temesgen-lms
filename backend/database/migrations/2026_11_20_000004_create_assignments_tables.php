<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Assignments
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('module_id')->nullable()->constrained('course_modules')->nullOnDelete();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('reference_attachment')->nullable();
            $table->integer('max_score')->default(100);
            $table->timestamp('due_date')->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });

        // 2. Assignment Submissions
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->longText('submission_text')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->enum('status', ['submitted', 'under_review', 'graded', 'late'])->default('submitted')->index();
            $table->decimal('grade', 5, 2)->nullable();
            $table->foreignId('instructor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(['assignment_id', 'user_id']);
        });

        // 3. Assignment Feedback
        Schema::create('assignment_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('assignment_submissions')->onDelete('cascade');
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->text('feedback_text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignment_feedback');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
    }
};
