<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statements', function(Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 63);
            $table->string('question', 511)->nullable();
            $table->string('text', 2047);
            $table->string('memo', 255)->nullable();
            $table->integer('position');
            $table->boolean('is_public');
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('list_id')->constrained('lists');
            $table->foreignUuid('topic_id')->constrained('topics');
            $table->foreignUuid('publisher_id')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
