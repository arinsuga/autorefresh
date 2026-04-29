<?php

use Illuminate\Database\Seeder;

class AppsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Reset table
        DB::table('apps')->delete();
        DB::table("apps")->insert([ "id" => 1, "code" => "mstapp", "name" => "Master Application", "description" => "Access for All Application", ]); 
        DB::table("apps")->insert([ "id" => 2, "code" => "cct", "name" => "Cost Control", "description" => "Online Cost Control", ]); 
        DB::table("apps")->insert([ "id" => 4, "code" => "cpt", "name" => "Checkpoint", "description" => "Online Checkpoint", ]); 
        
    }
}
