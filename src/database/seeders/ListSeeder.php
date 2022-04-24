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
        $sample_user_id = User::where('name', '=', 'sample1')->first()->id;
        ListModel::create([
            'title' => 'List1',
            'max_pos' => 1,
            'user_id' => $sample_user_id
        ]);

        $test_user_id = User::where('name', '=', 'test')->first()->id;
        ListModel::create([
            'title' => 'sample-list',
            'max_pos' => 1,
            'user_id' => $test_user_id
        ]);
    }
}
