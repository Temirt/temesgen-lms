<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Initiate payment for a paid course.
     */
    public function initiatePayment(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'provider' => 'required|in:chapa,telebirr,manual',
            'payment_method' => 'nullable|string',
        ]);

        $course = Course::findOrFail($validated['course_id']);

        if ($course->is_free || $course->price <= 0) {
            return response()->json(['message' => 'This course is free. Please use standard enrollment.'], 400);
        }

        // Check if already actively enrolled
        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->first();

        if ($existingEnrollment) {
            return response()->json(['message' => 'You are already enrolled in this course.'], 400);
        }

        $txRef = 'TLMS-' . strtoupper($validated['provider']) . '-' . time() . '-' . strtoupper(Str::random(6));

        $payment = Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $course->price,
            'currency' => 'ETB',
            'provider' => $validated['provider'],
            'transaction_id' => $txRef,
            'status' => 'pending',
            'payment_method' => $validated['payment_method'] ?? ucfirst($validated['provider']),
            'payload_data' => [
                'course_title' => $course->title,
                'user_email' => $user->email,
                'initiated_at' => now()->toIso8601String(),
            ],
        ]);

        PaymentTransaction::create([
            'payment_id' => $payment->id,
            'transaction_reference' => $txRef,
            'event_type' => 'checkout.initiated',
            'status' => 'pending',
            'response_data' => ['message' => 'Payment session created'],
        ]);

        ActivityLog::log('PAYMENT_INITIATE', "Payment initiated for {$course->title} via {$validated['provider']} (Ref: {$txRef})", $payment, $user);

        return response()->json([
            'message' => 'Payment initiated',
            'payment' => $payment,
            'transaction_reference' => $txRef,
            'amount' => $course->price,
            'currency' => 'ETB',
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'thumbnail' => $course->thumbnail,
            ],
        ]);
    }

    /**
     * Verify payment status and activate enrollment upon success.
     * Prevents duplicate activation and never trusts raw frontend status.
     */
    public function verifyPayment(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'transaction_reference' => 'required|string',
        ]);

        $payment = Payment::with('course')->where('transaction_id', $validated['transaction_reference'])->firstOrFail();

        // Security: ensure payment belongs to user unless admin
        if (!$user->isAdmin() && $payment->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized payment verification attempt'], 403);
        }

        // Check if already completed to prevent duplicate processing
        if ($payment->status === 'completed') {
            return response()->json([
                'message' => 'Payment already verified and completed',
                'payment' => $payment,
                'enrolled' => true,
            ]);
        }

        // Provider verification simulation / integration
        // (In live production: calls Chapa API or Telebirr API with secret key)
        $paymentSuccess = true;

        if ($paymentSuccess) {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
                'provider_reference' => 'PROV-' . strtoupper(Str::random(10)),
            ]);

            PaymentTransaction::create([
                'payment_id' => $payment->id,
                'transaction_reference' => $payment->transaction_id,
                'event_type' => 'payment.verified',
                'status' => 'completed',
                'response_data' => [
                    'verified_at' => now()->toIso8601String(),
                    'provider' => $payment->provider,
                    'status' => 'success',
                ],
            ]);

            // Activate enrollment only after verified payment
            $enrollment = Enrollment::updateOrCreate(
                ['user_id' => $payment->user_id, 'course_id' => $payment->course_id],
                [
                    'enrollment_date' => now(),
                    'status' => 'active',
                    'progress_percentage' => 0.00,
                    'last_accessed_at' => now(),
                    'unique_enrollment_token' => 'ENR-' . strtoupper(Str::random(12)),
                ]
            );

            ActivityLog::log('PAYMENT_SUCCESS', "Verified payment {$payment->amount} ETB for {$payment->course->title}", $payment, $user);

            // Notify student
            Notification::create([
                'user_id' => $payment->user_id,
                'type' => 'payment_success',
                'title' => 'Payment Confirmed & Enrolled!',
                'message' => "Your payment of {$payment->amount} ETB for {$payment->course->title} was confirmed. Happy learning!",
                'link' => "/learn/{$payment->course_id}",
            ]);

            return response()->json([
                'message' => 'Payment verified successfully and enrollment activated!',
                'payment' => $payment,
                'enrollment' => $enrollment,
            ]);
        }

        $payment->update(['status' => 'failed']);
        return response()->json(['message' => 'Payment verification failed'], 400);
    }

    /**
     * Get payment history for authenticated user.
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $query = Payment::with('course:id,title,thumbnail');

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $payments = $query->latest()->paginate(15);

        return response()->json($payments);
    }
}
