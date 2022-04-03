<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Model;
// use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;
use App\Models\Statement;

class Topic extends Model
{
    use HasFactory;

    use Uuid;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $casts = [
        'is_available' => 'boolean'
    ];

    protected $fillable = ['subject', 'unit', 'name', 'is_available'];

    public function statements() {
        return $this->hasMany(Statement::class);
    }
}
