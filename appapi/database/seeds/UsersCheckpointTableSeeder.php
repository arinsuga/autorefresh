<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class UsersCheckpointTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /** DNB Users */        
        DB::table("users")->insert([
            "id" => 56,
            "name" => "aviantoro",
            "email" => "aviantoro@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 67,
            "name" => "yohanes_haumahu",
            "email" => "yohanes_haumahu@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 128,
            "name" => "anggraini_ramsey",
            "email" => "anggraini_ramsey@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 149,
            "name" => "m.ichwan",
            "email" => "m.ichwan@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 200,
            "name" => "arizka",
            "email" => "arizka@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 329,
            "name" => "araaf",
            "email" => "araaf@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 330,
            "name" => "nadya.aliya",
            "email" => "nadya.aliya@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 331,
            "name" => "farah",
            "email" => "farah@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 332,
            "name" => "khairunnisya",
            "email" => "khairunnisya@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 333,
            "name" => "derry",
            "email" => "derry@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 334,
            "name" => "zulfikar",
            "email" => "zulfikar@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 335,
            "name" => "eko.sp",
            "email" => "eko.sp@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 336,
            "name" => "kasiman",
            "email" => "kasiman@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 337,
            "name" => "nardhani",
            "email" => "nardhani@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 338,
            "name" => "imam",
            "email" => "imam@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 339,
            "name" => "suhendri",
            "email" => "suhendri@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);
     
        DB::table("users")->insert([
            "id" => 340,
            "name" => "heri",
            "email" => "heri@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 341,
            "name" => "adnan",
            "email" => "adnan@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 342,
            "name" => "tatang",
            "email" => "tatang@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 343,
            "name" => "zulkifli",
            "email" => "zulkifli@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 344,
            "name" => "adrin",
            "email" => "adrin@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 345,
            "name" => "maulana",
            "email" => "maulana@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 346,
            "name" => "robbi",
            "email" => "robbi@master.com",
            "email_verified_at" => now(),
            "dept" => "DNB",
            "noabsen" => null,
            "password" => Hash::make("masterapp99"),
            "remember_token" => Str::random(10),
            "bo" => false,
            "disabled" => false,
        ]);

        DB::table("users")->insert([
            "id" => 347,
            "name" => "dwiyanahm",
            "email" => "dwiyanahm@master.com",
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
