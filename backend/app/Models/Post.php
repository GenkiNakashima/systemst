<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'content',
        'is_ai_flagged',
        'ai_flag_reason',
    ];

    protected $casts = [
        'is_ai_flagged' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(Reply::class);
    }

    public function reactions()
    {
        return $this->hasMany(PostReaction::class);
    }

    public function reactionsCount()
    {
        return $this->reactions()->count();
    }

    public function hasReactionFrom($userId)
    {
        return $this->reactions()->where('user_id', $userId)->exists();
    }
}
