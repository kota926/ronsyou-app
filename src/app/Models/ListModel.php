<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Model;
// use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Model;
use App\Models\Statement;

class ListModel extends Model
{
    use HasFactory;

    use Uuid;

    protected $table = 'lists';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['title', 'max_pos'];

    public function statements() {
        return $this->hasMany(Statement::class, 'list_id');
    }
}
