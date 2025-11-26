<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scenarios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('category'); // Network, Security, DB, Performance
            $table->integer('difficulty'); // 1-5
            $table->text('description');
            $table->json('environment_config');
            $table->text('broken_code_snippet');
            $table->json('solution_validation_rule');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scenarios');
    }
};
