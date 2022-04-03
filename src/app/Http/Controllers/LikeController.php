<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Statement;

class LikeController extends Controller
{
    public function index(Request $request) {
        if($request->user_id) {
            $count = Like::where('statement_id', '=', $request->statement_id)->count();
            $is_exist = Like::where('statement_id', '=', $request->statement_id)
                ->where('user_id', '=', $request->user_id)
                ->exists();
            $res = [
                'count' => $count,
                'is_exist' => $is_exist
            ];
            return response()->json($res);
        } else {
            $count = Like::where('statement_id', '=', $request->statement_id)->count();
            $res = [
                'count' => $count,
                'is_exist' => false
            ];
            return response()->json($res);
        }
    }

    public function create(Request $request) {
        $like = new Like([
            'statement_id' => $request->statement_id,
            'user_id' => $request->user_id
        ]);
        $like->save();
        return response()->json($like);
    }

    public function delete(Request $request) {
        $like = Like::where('statement_id', '=', $request->statement_id)
            ->where('user_id', '=', $request->user_id)
            ->delete();
        return $like;
    }
}
