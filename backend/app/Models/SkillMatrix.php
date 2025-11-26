<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkillMatrix extends Model
{
    protected $table = 'skill_matrix';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'network_score',
        'db_score',
        'security_score',
        'performance_score',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
