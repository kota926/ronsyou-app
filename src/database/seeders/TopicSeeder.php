<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Topic;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Topic::create([
            'subject' => '民法',
            'unit' => '留置権',
            'name' => '295条2項の間接適用',
            'is_available' => true
        ]);

        Topic::create([
            'subject' => '民訴',
            'unit' => '訴訟要件',
            'name' => '遺言無効確認の訴えの確認の利益',
            'is_available' => true
        ]);
    }
}
