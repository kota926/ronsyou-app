<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Statement;
use App\Models\ListModel;

class StatementController extends Controller
{
    public function create(Request $request) {
        $statement = new Statement([
            'title' => $request->title,
            "question" => $request->question,
            "text" => $request->text,
            "memo" => $request->memo,
            "position" => $request->position,
            "is_public" => $request->is_public,
            "user_id" => $request->user_id,
            "list_id" => $request->list_id,
            "topic_id" => $request->topic_id,
            "publisher_id" => $request->publisher_id
        ]);
        // $statement->title = $request->title;
        // $statement->question = $request->question;
        // $statement->text = $request->text;
        // $statement->memo = $request->memo;
        // $statement->is_public = $request->is_public;
        // $statement->title = $request->title;
        // $statement->user_id = $request->user_id;
        // $list = ListModel::find($request->list_id);
        // $list->statements()->save($statement);
        $statement->save();
        return response()->json($statement);
    }

    public function index(Request $request) {
        $list_id = $request->list_id;
        $subject = $request->subject;
        $unit = $request->unit;
        $topic = $request->topic;
        $word = $request->word;
        // 論証集の画面で表示するListが所有する論証
        if($list_id) {
            $statements = Statement::with('topic')->where('list_id', $list_id)->get();
            return response()->json($statements);
        } else if($word) {
            // 検索ワードと論点が条件
            if($topic) {
                $statements = Statement::with('topic')
                    ->where('is_public', true)
                    // 曖昧検索は title, question, text, unit, topic_name
                    ->whereHas('topic', function($query) use ($subject, $unit, $topic) {
                        $query->where([['subject', '=', $subject],['unit', '=', $unit],['name', '=', $topic]]);
                    })->where(function($query) use($word) {
                        $query->where('title', 'LIKE', '%'.$word.'%')
                        ->orWhere('question', 'LIKE', '%'.$word.'%')
                        ->orWhere('text', 'LIKE', '%'.$word.'%')
                        ->orWhereHas('topic', function($topic_query) use ($word) {
                            $topic_query->where('unit', 'LIKE', '%'.$word.'%')
                            ->orWhere('name', 'LIKE', '%'.$word.'%');
                        });
                    })->get();
                return response()->json($statements);
            // 検索ワードと単元が条件
            } else if($unit) {
                $statements = Statement::with('topic')
                    ->where('is_public', true)
                    ->whereHas('topic', function($query) use ($subject, $unit) {
                        $query->where([['subject', '=', $subject],['unit', '=', $unit]]);
                    })->where(function($query) use($word) {
                        $query->where('title', 'LIKE', '%'.$word.'%')
                        ->orWhere('question', 'LIKE', '%'.$word.'%')
                        ->orWhere('text', 'LIKE', '%'.$word.'%')
                        ->orWhereHas('topic', function($topic_query) use ($word) {
                            $topic_query->where('unit', 'LIKE', '%'.$word.'%')
                            ->orWhere('name', 'LIKE', '%'.$word.'%');
                        });
                    })->get();
                return response()->json($statements);
            // 検索ワードと科目が条件
            } else if($subject) {
                $statements = Statement::with('topic')
                    ->where('is_public', true)  
                    ->whereHas('topic', function($query) use ($subject) {
                        $query->where('subject', '=', $subject);
                    })->where(function($query) use($word) {
                        $query->where('title', 'LIKE', '%'.$word.'%')
                        ->orWhere('question', 'LIKE', '%'.$word.'%')
                        ->orWhere('text', 'LIKE', '%'.$word.'%')
                        ->orWhereHas('topic', function($topic_query) use ($word) {
                            $topic_query->where('unit', 'LIKE', '%'.$word.'%')
                            ->orWhere('name', 'LIKE', '%'.$word.'%');
                        });
                    })->get();
                return response()->json($statements);
            // 検索ワードのみで絞り込み
            } else {
                $statements = Statement::with('topic')
                    ->where('is_public', true)
                    ->where('title', 'LIKE', '%'.$word.'%')
                    ->orWhere('question', 'LIKE', '%'.$word.'%')
                    ->orWhere('text', 'LIKE', '%'.$word.'%')
                    ->orWhereHas('topic', function($query) use ($word) {
                        $query->where('unit', 'LIKE', '%'.$word.'%')
                        ->orWhere('name', 'LIKE', '%'.$word.'%');
                    })->get();
                return response()->json($statements);
            }
        // 論点で絞り込み
        } else if($topic) {
            $statements = Statement::with('topic')
            ->where('is_public', true)
            ->whereHas('topic', function($query) use ($subject, $unit, $topic) {
                $query->where([['subject', '=', $subject],['unit', '=', $unit],['name', '=', $topic]]);
            })->get();
            
            return response()->json($statements);
        // 単元で絞り込み
        } else if($unit) {
            $statements = Statement::with('topic')
            ->where('is_public', true)
            ->whereHas('topic', function($query) use ($subject, $unit) {
                $query->where([['subject', '=', $subject],['unit', '=', $unit]]);
            })->get();
            return response()->json($statements);
        // 科目で絞り込み
        } else if($subject) {
            $statements = Statement::with('topic')
            ->where('is_public', true)
            ->whereHas('topic', function($query) use ($subject) {
                $query->where([['subject', '=', $subject]]);
            })->get();
            return response()->json($statements);
        // すべての論証を取得
        } else {
            $statements = Statement::with('topic')->where('is_public', true)->get();
            return response()->json($statements);
        }
        
    }

    public function update(Request $request) {
        $statement = Statement::find($request->id);
        $statement->title = $request->title;
        $statement->topic_id = $request->topic_id;
        $statement->question = $request->question;
        $statement->text = $request->text;
        $statement->memo = $request->memo;
        $statement->save();
        return response()->json($statement);
    }

    public function delete($id) {
        $statement = Statement::find($id);
        $statement->likes()->delete();
        $statement->delete();
        return response()->json($statement);
    }
}
