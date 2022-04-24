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
        $sample_topic_id = Topic::where('name', '=', '295条2項の間接適用')->first()->id;
        $sample_list_id = ListModel::where('title', '=', 'List1')->first()->id;
        $sample_user_id = User::where('name', '=', 'sample1',)->first()->id;
        Statement::create([
            'title' => 'サンプルタイトル',
            'question' => 'Yの占有は賃借権という正当な権原に基づいて始まっており、「占有が不法行為によって始まった場合」ではない。占有すべき権原を初めは持っていたが後に喪失した場合に295条2項は直接適用されないが、このような場合に295条2項が間接適用されるか。',
            'text' => '留置権の趣旨は当事者間の公平にある。本来であれば、占有権原を喪失した時点で物を明け渡すべきであったところ、占有を継続し、その間に「その物に関して生じた債権」を取得した場合に、留置権の成立を認めるのは、物の明渡債務の履行を遅滞している者に利益を与えるものであるから、留置権の趣旨に反する。そこで、途中から不法占有となった場合は、自己の占有権原が無権原である可能性につき悪意または有過失であれば、295条2項が類する適用されると解する。',
            'memo' => 'メモ',
            'position' => 1,
            'is_public' => true,
            'topic_id' => $sample_topic_id,
            'list_id' => $sample_list_id,
            'user_id' => $sample_user_id,
            'publisher_id' => $sample_user_id,
        ]);

        $test_topic_id = Topic::where('name', '=', '遺言無効確認の訴えの確認の利益')->first()->id;
        $test_list_id = ListModel::where('title', '=', 'sample-list')->first()->id;
        $test_user_id = User::where('name', '=', 'test',)->first()->id;
        Statement::create([
            'title' => '確認の利益',
            'question' => '遺言者Aが死亡した後、Aの相続人の一人であるXらが遺言無効確認の訴えを提起しているが、この訴えが適法となるためには、確認の利益が認められなければならない。確認の利益の有無についての判断基準について検討せよ。',
            'text' => '遺言無効確認の訴えは、形式上過去の法律行為の確認を求めるものであるため、対象選択の適切性を欠くように思える。しかし、当事者間の紛争の直接的な対象である基本的法律行為たる遺言の無効の当否を判断することによって、現在生じている遺産分割をめぐる紛争を包括的に解決することで、確認訴訟の持つ紛争解決機能が果たされ、直接かつ抜本的な紛争解決に資する場合がある。したがって、遺言が有効であるとすればそこから生ずべき現在の特定の法律関係が存在しないことの確認を求めるものと解する場合で、原告がかかる確認を求めるにつき法律上の利益を有するときには、対象選択の適切性が認められる。',
            'memo' => 'ここにメモを書き込みます。',
            'position' => 1,
            'is_public' => true,
            'topic_id' => $test_topic_id,
            'list_id' => $test_list_id,
            'user_id' => $test_user_id,
            'publisher_id' => $test_user_id,
        ]);
    }
}
