<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ListModel;
use App\Models\User;

class ListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user_id = User::where('name', '=', 'sample1')->first()->id;
        ListModel::create([
            'title' => 'List1',
            'max_pos' => 1,
            'user_id' => $user_id
        ]);
    }
}
