<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * List quizzes for a course.
     */
    public function index(Request $request, $courseId)
    {
        $quizzes = Quiz::where('course_id', $courseId)
            ->withCount('questions')
            ->with('questions.options')
            ->get();

        return response()->json($quizzes);
    }

    /**
     * Get quiz with questions for taking or reviewing.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $quiz = Quiz::with('course:id,title,instructor_id')->findOrFail($id);

        $isInstructorOrAdmin = $user->isAdmin() || $quiz->course->instructor_id === $user->id;

        // If instructor or admin, include correct answers. Otherwise hide correct answers.
        $quiz->load(['questions' => function ($q) use ($isInstructorOrAdmin) {
            $q->orderBy('sort_order', 'asc')
              ->with(['options' => function ($oq) use ($isInstructorOrAdmin) {
                  $oq->orderBy('sort_order', 'asc');
                  if (!$isInstructorOrAdmin) {
                      $oq->select('id', 'question_id', 'option_text', 'sort_order');
                  }
              }]);
        }]);

        // Get student's previous attempts
        $attempts = QuizAttempt::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->latest()
            ->get();

        $canAttempt = $attempts->count() < $quiz->max_attempts;

        return response()->json([
            'quiz' => $quiz,
            'attempts' => $attempts,
            'can_attempt' => $canAttempt,
            'attempts_left' => max(0, $quiz->max_attempts - $attempts->count()),
        ]);
    }

    /**
     * Submit quiz answers and auto-grade.
     */
    public function submitAttempt(Request $request, $id)
    {
        $user = $request->user();
        $quiz = Quiz::with(['questions.options', 'course'])->findOrFail($id);

        // Check max attempts
        $attemptCount = QuizAttempt::where('user_id', $user->id)->where('quiz_id', $quiz->id)->count();
        if ($attemptCount >= $quiz->max_attempts) {
            return response()->json(['message' => 'You have reached the maximum number of attempts for this quiz.'], 403);
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_option_id' => 'nullable|exists:question_options,id',
            'answers.*.text_answer' => 'nullable|string',
        ]);

        $totalPoints = 0;
        $earnedPoints = 0;
        $gradedAnswers = [];

        foreach ($quiz->questions as $question) {
            $totalPoints += $question->points;

            // Find student's answer for this question
            $studentAnswer = collect($validated['answers'])->firstWhere('question_id', $question->id);
            $selectedOptionId = $studentAnswer['selected_option_id'] ?? null;
            $textAnswer = $studentAnswer['text_answer'] ?? null;

            $isCorrect = false;
            $pointsAwarded = 0;

            if ($question->question_type === 'multiple_choice' || $question->question_type === 'true_false') {
                if ($selectedOptionId) {
                    $option = $question->options->firstWhere('id', $selectedOptionId);
                    if ($option && $option->is_correct) {
                        $isCorrect = true;
                        $pointsAwarded = $question->points;
                        $earnedPoints += $question->points;
                    }
                }
            } elseif ($question->question_type === 'short_answer') {
                // Check if matches explanation or option
                $correctOption = $question->options->firstWhere('is_correct', true);
                if ($correctOption && strtolower(trim($textAnswer ?? '')) === strtolower(trim($correctOption->option_text))) {
                    $isCorrect = true;
                    $pointsAwarded = $question->points;
                    $earnedPoints += $question->points;
                }
            }

            $gradedAnswers[] = [
                'question_id' => $question->id,
                'selected_option_id' => $selectedOptionId,
                'text_answer' => $textAnswer,
                'is_correct' => $isCorrect,
                'points_awarded' => $pointsAwarded,
            ];
        }

        $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;
        $isPassed = $percentage >= $quiz->passing_score;

        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'attempt_number' => $attemptCount + 1,
            'score' => $earnedPoints,
            'total_points' => $totalPoints,
            'percentage' => $percentage,
            'is_passed' => $isPassed,
            'status' => 'completed',
            'started_at' => now()->subMinutes(5),
            'completed_at' => now(),
        ]);

        foreach ($gradedAnswers as $ga) {
            $ga['attempt_id'] = $attempt->id;
            QuizAnswer::create($ga);
        }

        ActivityLog::log('QUIZ_SUBMIT', "User {$user->name} submitted quiz {$quiz->title} (Score: {$percentage}%)", $quiz, $user);

        // Notify user
        Notification::create([
            'user_id' => $user->id,
            'type' => 'quiz_result',
            'title' => $isPassed ? 'Quiz Passed!' : 'Quiz Attempt Completed',
            'message' => "You scored {$percentage}% on {$quiz->title}. " . ($isPassed ? 'Passing grade achieved!' : 'Keep practicing!'),
            'link' => "/learn/{$quiz->course_id}",
        ]);

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'attempt' => $attempt->load(['answers.question', 'answers.selectedOption']),
            'is_passed' => $isPassed,
            'score' => $earnedPoints,
            'total_points' => $totalPoints,
            'percentage' => $percentage,
        ]);
    }

    /**
     * Create a quiz (Instructor/Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'module_id' => 'nullable|exists:course_modules,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:1|max:100',
            'max_attempts' => 'required|integer|min:1',
            'randomize_questions' => 'boolean',
            'questions' => 'nullable|array',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|in:multiple_choice,true_false,short_answer',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.options' => 'required|array',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        $quiz = Quiz::create([
            'course_id' => $validated['course_id'],
            'module_id' => $validated['module_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'duration_minutes' => $validated['duration_minutes'],
            'passing_score' => $validated['passing_score'],
            'max_attempts' => $validated['max_attempts'],
            'randomize_questions' => $validated['randomize_questions'] ?? false,
            'is_published' => true,
        ]);

        if (!empty($validated['questions'])) {
            foreach ($validated['questions'] as $i => $qData) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $qData['question_text'],
                    'question_type' => $qData['question_type'],
                    'points' => $qData['points'],
                    'sort_order' => $i + 1,
                ]);

                foreach ($qData['options'] as $j => $optData) {
                    QuestionOption::create([
                        'question_id' => $question->id,
                        'option_text' => $optData['option_text'],
                        'is_correct' => $optData['is_correct'],
                        'sort_order' => $j + 1,
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Quiz created successfully',
            'quiz' => $quiz->load('questions.options'),
        ], 201);
    }
}
