<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class UsersHRDTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        /** HRD */        
        DB::table("users")->insert([
            "id" => 257,
            "name" => "Dede Adang",
            "email" => "adang@master.com",
            "email_verified_at" => now(),
            "dept" => "HRD",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);


    }
}
