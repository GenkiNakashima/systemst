<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user
        User::create([
            'id' => Str::uuid(),
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'current_level' => 1,
        ]);

        // Seed scenarios
        $this->call([
            ScenarioSeeder::class,
        ]);
    }
}
