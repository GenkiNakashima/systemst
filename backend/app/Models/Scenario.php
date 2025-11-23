<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scenario extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'category',
        'difficulty',
        'description',
        'environment_config',
        'broken_code_snippet',
        'solution_validation_rule',
    ];

    protected $casts = [
        'environment_config' => 'array',
        'solution_validation_rule' => 'array',
    ];

    public function attempts(): HasMany
    {
        return $this->hasMany(UserAttempt::class);
    }
}
