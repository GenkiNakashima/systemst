<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_matrix', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->integer('network_score')->default(0);
            $table->integer('db_score')->default(0);
            $table->integer('security_score')->default(0);
            $table->integer('performance_score')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_matrix');
    }
};
