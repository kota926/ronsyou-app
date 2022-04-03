<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\TopicSeeder;
use Database\Seeders\ListSeeder;
use Database\Seeders\StatementSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call(UserSeeder::class);
        $this->call(TopicSeeder::class);
        $this->call(ListSeeder::class);
        $this->call(StatementSeeder::class);
    }
}
