<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Model;
// use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;
use App\Models\Statement;
use App\Models\User;

class Like extends Model
{
    use HasFactory;

    use Uuid;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'statement_id',
    ];

    public function statement() {
        return $this->belongsTo(Statement::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
