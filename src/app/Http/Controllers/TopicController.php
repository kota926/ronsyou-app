<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Topic;

class TopicController extends Controller
{
   public function create(Request $request) {
       $topic = new Topic([
           'subject' => $request->subject,
           'unit' => $request->unit,
           'name' => $request->name,
           'is_available' => false
       ]);
       $topic->save();
       return response()->json($topic);
   }
   public function index(Request $request) {
       $topic = Topic::all();
       return response()->json(($topic));
   }

   public function get($subject, $unit) {
       $topic = Topic::where('subject', $subject)->where('unit', $unit)->get();
       return response()->json($topic);
   }

   public function update(Request $request) {
       $topic = Topic::find($request->id);
       $topic->is_available = $request->is_available;
       $topic->save();
       return response()->json($topic);
   }
}
