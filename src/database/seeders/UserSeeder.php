<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        User::create([
            'name' => 'sample1',
            'email' => 'sample1@sample.com',
            'password' => Hash::make('sample_1'),
        ]);

        User::create([
            'name' => 'sample2',
            'email' => 'sample2@sample.com',
            'password' => Hash::make('sample_2'),
        ]);

        User::create([
            'name' => 'sample3',
            'email' => 'sample3@sample.com',
            'password' => Hash::make('sample_3'),
        ]);

        User::create([
            'name' => 'sample4',
            'email' => 'sample4@sample.com',
            'password' => Hash::make('sample_4'),
        ]);
    }
}
