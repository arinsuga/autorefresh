<?php

use Illuminate\Database\Seeder;

class RoleUserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /** Reset table */
        DB::table('role_user')->delete();

        /** Master Users */
        DB::table("role_user")->insert([ "id" => 1, "app_id" => 1, "role_id" => 1, "user_id" => 1, "created_at" => null, "updated_at" => null, ]); 
        DB::table("role_user")->insert([ "id" => 2, "app_id" => 1, "role_id" => 2, "user_id" => 2, "created_at" => null, "updated_at" => null, ]); 
        DB::table("role_user")->insert([ "id" => 3, "app_id" => 1, "role_id" => 3, "user_id" => 3, "created_at" => null, "updated_at" => null, ]); 
        DB::table("role_user")->insert([ "id" => 4, "app_id" => 1, "role_id" => 4, "user_id" => 4, "created_at" => null, "updated_at" => null, ]); 
        DB::table("role_user")->insert([ "id" => 5, "app_id" => 1, "role_id" => 4, "user_id" => 5, "created_at" => null, "updated_at" => null, ]); 

        /** Additional Users - Autorefresh */
        // arf-super : owner
        DB::table("role_user")->insert([ "id" => 6, "app_id" => 2, "role_id" => 5, "user_id" => 6, "created_at" => null, "updated_at" => null, ]);
        // arf-admin: kasir
        DB::table("role_user")->insert([ "id" => 7, "app_id" => 2, "role_id" => 6, "user_id" => 7, "created_at" => null, "updated_at" => null, ]);

    }
}
