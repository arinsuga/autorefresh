<?php

use Illuminate\Database\Seeder;

class AppUserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Reset table
        DB::table('app_user')->delete();

        /** Master Application Users */
        DB::table("app_user")->insert([ "app_id" => 1, "user_id" => 1, "created_at" => null, "updated_at" => null ]); 
        
        /** Autorefresh Application Users */
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 2, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 3, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 4, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 5, "created_at" => null, "updated_at" => null ]); 
        
    }
}
