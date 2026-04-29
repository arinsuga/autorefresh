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
        DB::table("roles")->insert([ "id" => 2, "app_id" => 2, "code" => "cct-super", "name" => "Cost Control Super Admin", "description" => "Hak Akses: Full Control" ]); 
        DB::table("roles")->insert([ "id" => 3, "app_id" => 2, "code" => "cct-admin", "name" => "Cost Control Admin", "description" => "Hak Akses: Reporting, User Access" ]); 
        DB::table("roles")->insert([ "id" => 4, "app_id" => 2, "code" => "cct-user", "name" => "Cost Control User", "description" => "Hak Akses: Cost Control" ]);

        // Checkpoint Roles
        DB::table("roles")->insert([ "id" => 10, "app_id" => 4, "code" => "dnb-super", "name" => "Super User DNB", "description" => "Hak Akses: Full Control" ]); 
        DB::table("roles")->insert([ "id" => 11, "app_id" => 4, "code" => "dnb-admin", "name" => "Admin DNB", "description" => "Hak Akses: Reporting, User Access" ]); 
        DB::table("roles")->insert([ "id" => 12, "app_id" => 4, "code" => "dnb-dsg", "name" => "Designer DNB", "description" => "Hak Akses: Checkin – Checkout, History" ]); 
        DB::table("roles")->insert([ "id" => 13, "app_id" => 4, "code" => "dnb-plk", "name" => "Pelaksana DNB", "description" => "Hak Akses: Checkin – Checkout, History" ]); 
        DB::table("roles")->insert([ "id" => 14, "app_id" => 4, "code" => "dnb-user", "name" => "User DNB", "description" => "Hak Akses: Checkin – Checkout, History" ]); 
        DB::table("roles")->insert([ "id" => 15, "app_id" => 4, "code" => "hrd-super", "name" => "Super User HRD", "description" => "Hak Akses: Reporting Absen Checkin – Checkout" ]); 
        DB::table("roles")->insert([ "id" => 16, "app_id" => 4, "code" => "hrd-admin", "name" => "Admin HRD", "description" => "Hak Akses: Reporting Absen Checkin – Checkout" ]); 

    }
}
