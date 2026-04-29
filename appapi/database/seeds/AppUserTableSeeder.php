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
        
        /** Basic Users - cost control */
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 2, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 3, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 4, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 5, "created_at" => null, "updated_at" => null ]); 
        /** Basic Users - checkpoint */
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 2, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 3, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 4, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 5, "created_at" => null, "updated_at" => null ]); 


        /** DNB - Checkpoint Production Users */
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 56, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 67, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 149, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 200, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 329, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 330, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 331, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 332, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 333, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 344, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 335, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 336, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 337, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 338, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 339, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 340, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 341, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 342, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 343, "created_at" => null, "updated_at" => null ]); 
        DB::table("app_user")->insert([ "app_id" => 4, "user_id" => 257, "created_at" => null, "updated_at" => null ]); 

        /** DNB - Cost Control Production Users */
        // jaya@hadiprana.co.id
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 501, "created_at" => null, "updated_at" => null ]); 
        // donny_krishna@hadiprana.co.id
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 502, "created_at" => null, "updated_at" => null ]); 
        // ika.sisti@hadiprana.co.id
        DB::table("app_user")->insert([ "app_id" => 2, "user_id" => 503, "created_at" => null, "updated_at" => null ]); 
        
    }
}
