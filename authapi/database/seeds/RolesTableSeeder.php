<?php

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        //Reset table
        DB::table('roles')->delete();
        
        // Master Roles
        DB::table("roles")->insert([ "id" => 1, "app_id" => 1, "code" => "masterrole", "name" => "Master Role", "description" => "Full Control For All Apps" ]); 
        DB::table("roles")->insert([ "id" => 2, "app_id" => 1, "code" => "superrole", "name" => "Super Role", "description" => "Super Admin Access Control" ]); 
        DB::table("roles")->insert([ "id" => 3, "app_id" => 1, "code" => "adminrole", "name" => "Admin Role", "description" => "Admin Access Control" ]); 
        DB::table("roles")->insert([ "id" => 4, "app_id" => 1, "code" => "userrole", "name" => "User Role", "description" => "User Access" ]); 

        // Autorefresh Roles
        DB::table("roles")->insert([ "id" => 5, "app_id" => 2, "code" => "arf-super", "name" => "Owner BSCSteam", "description" => "Hak Akses: Owner" ]); 
        DB::table("roles")->insert([ "id" => 6, "app_id" => 2, "code" => "arf-admin", "name" => "Kasir BSCSteam", "description" => "Hak Akses: Kasir" ]); 

    }
}
