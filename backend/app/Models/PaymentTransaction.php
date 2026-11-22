<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'transaction_reference',
        'event_type',
        'status',
        'response_data',
    ];

    protected $casts = [
        'response_data' => 'array',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
