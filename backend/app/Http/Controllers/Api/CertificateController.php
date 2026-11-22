<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    /**
     * Get authenticated student's certificates.
     */
    public function myCertificates(Request $request)
    {
        $user = $request->user();

        $certificates = Certificate::with(['course:id,title,thumbnail,duration_hours', 'course.instructor:id,name'])
            ->where('user_id', $user->id)
            ->latest('issue_date')
            ->get();

        return response()->json($certificates);
    }

    /**
     * Show certificate details.
     */
    public function show(Request $request, $id)
    {
        $certificate = Certificate::with(['course:id,title,thumbnail,category_id', 'user:id,name,email'])
            ->where('id', $id)
            ->orWhere('certificate_number', $id)
            ->firstOrFail();

        return response()->json($certificate);
    }

    /**
     * Public verification endpoint by certificate number.
     */
    public function verify(Request $request)
    {
        $number = $request->input('number') ?? $request->input('id');

        if (!$number) {
            return response()->json(['message' => 'Certificate number is required'], 400);
        }

        $certificate = Certificate::with(['course:id,title,thumbnail', 'user:id,name'])
            ->where('certificate_number', trim($number))
            ->first();

        if (!$certificate) {
            return response()->json([
                'valid' => false,
                'message' => 'No certificate found with the provided identification number. Please check the ID and try again.',
            ], 404);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Certificate verified and authenticated by Temesgen LMS.',
            'certificate' => $certificate,
        ]);
    }
}
