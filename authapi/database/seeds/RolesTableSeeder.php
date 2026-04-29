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
        DB::table("roles")->insert([ "id" => 1, "app_id" => 1, "code" => "mstrole", "name" => "Master Role", "description" => "Full Control For All Apps" ]); 

        // Cost Control Roles
        DB::table("roles")->insert([ "id" => 2, "app_id" => 2, "code" => "arf-super", "name" => "Autorefresh Super Admin", "description" => "Hak Akses: Full Control" ]); 
        DB::table("roles")->insert([ "id" => 3, "app_id" => 2, "code" => "arf-admin", "name" => "Autorefresh Admin", "description" => "Hak Akses: Reporting, User Access" ]); 

    }
}
