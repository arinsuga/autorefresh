<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset table
        DB::table('users')->delete();

        /** Basic Users */
        DB::table("users")->insert([
            "id" => 1,
            "name" => "Master User",
            "email" => "master@master.com",
            "email_verified_at" => now(),
            "dept" => null,
            "noabsen" => null,
            "password" => Hash::make('masterapp99'),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]); 
        DB::table("users")->insert([
            "id" => 2,
            "name" => "Super Admin",
            "email" => "sa@master.com",
            "email_verified_at" => now(),
            "dept" => null,
            "noabsen" => null,
            "password" => Hash::make('masterapp99'),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]); 
        DB::table("users")->insert([
            "id" => 3,
            "name" => "Admin",
            "email" => "admin@master.com",
            "email_verified_at" => now(),
            "dept" => null,
            "noabsen" => null,
            "password" => Hash::make('masterapp99'),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]); 
        DB::table("users")->insert([
            "id" => 4,
            "name" => "John",
            "email" => "john@master.com",
            "email_verified_at" => now(),
            "dept" => null,
            "noabsen" => null,
            "password" => Hash::make('masterapp99'),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]); 
        DB::table("users")->insert([
            "id" => 5,
            "name" => "Lisa",
            "email" => "lisa@master.com",
            "email_verified_at" => now(),
            "dept" => null,
            "noabsen" => null,
            "password" => Hash::make('masterapp99'),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]); 
    }
}
