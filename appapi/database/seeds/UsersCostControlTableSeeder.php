<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class UsersCostControlTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        /** DNB - Cost Control Users */        
        DB::table("users")->insert([
            "id" => 501,
            "name" => "Jaya",
            "email" => "jaya@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 502,
            "name" => "Donny Krishna",
            "email" => "donny_krishna@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 503,
            "name" => "Ika Sisti",
            "email" => "ika.sisti@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

    }
}
