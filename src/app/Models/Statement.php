<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Model;
// use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;
use App\Models\Topic;
use App\Models\Like;

class Statement extends Model
{
    use HasFactory;

    use Uuid;

    public $incrementing = false;

    protected $keyType = 'string';
    
    protected $casts = [
        'is_public' => 'boolean'
    ];

    protected $fillable = [
        'title',
        'question',
        'text',
        'memo',
        'position',
        'is_public',
        'user_id',
        'list_id',
        'topic_id',
        'publisher_id'
    ];

    public function topic() {
        return $this->belongsTo(Topic::class);
    }

    public function likes() {
        return $this->hasMany(Like::class);
    }
}
