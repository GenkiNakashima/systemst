<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIFeedback extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'ai_feedbacks';

    protected $fillable = [
        'id',
        'attempt_id',
        'feedback_content',
        'score',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(UserAttempt::class, 'attempt_id');
    }
}
