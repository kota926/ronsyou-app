<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ListModel;
use App\Models\User;

class ListController extends Controller
{
    public function create(Request $request) {
        $list = new ListModel([
            'title' => $request->input('title'),
            'max_pos' => 0
        ]);
        
        $user = User::find($request->id);

        $user->lists()->save($list);

        return response()->json($list);
    }

    public function index(Request $request) {
        $lists =  ListModel::where('user_id', $request->user_id)->get();
        return response()->json($lists);
    }

    public function show($id) {
        $list = ListModel::where('id', $id)->first();
        return response()->json($list);
    }

    public function update($id, Request $request) {
        $list = ListModel::find($id);
        if($request->input('title')){
            $list->title = $request->input('title');
        } else if($request->input('max_pos')) {
            $list->max_pos = $request->input('max_pos');
        }
        $list->save();
        return response()->json($list);
    }

    public function delete($id) {
        $list = ListModel::find($id);
        $list->statements()->delete();
        $list->delete();
        return response()->json($list);
    }
}
