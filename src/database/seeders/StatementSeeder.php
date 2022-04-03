<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Topic;
use App\Models\ListModel;
use App\Models\User;
use App\Models\Statement;

class StatementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $topic_id = Topic::where('name', '=', '295条2項の間接適用')->first()->id;
        $list_id = ListModel::where('title', '=', 'List1')->first()->id;
        $user_id = User::where('name', '=', 'sample1',)->first()->id;
        Statement::create([
            'title' => 'タイトル1',
            'question' => 'Yの占有は賃借権という正当な権原に基づいて始まっており、「占有が不法行為によって始まった場合」ではない。占有すべき権原を初めは持っていたが後に喪失した場合に295条2項は直接適用されないが、このような場合に295条2項が間接適用されるか。',
            'text' => '留置権の趣旨は当事者間の公平にある。本来であれば、占有権原を喪失した時点で物を明け渡すべきであったところ、占有を継続し、その間に「その物に関して生じた債権」を取得した場合に、留置権の成立を認めるのは、物の明渡債務の履行を遅滞している者に利益を与えるものであるから、留置権の趣旨に反する。そこで、途中から不法占有となった場合は、自己の占有権原が無権原である可能性につき悪意または有過失であれば、295条2項が類する適用されると解する。',
            'memo' => 'メモ',
            'position' => 1,
            'is_public' => true,
            'topic_id' => $topic_id,
            'list_id' => $list_id,
            'user_id' => $user_id,
            'publisher_id' => $user_id,
        ]);
    }
}
