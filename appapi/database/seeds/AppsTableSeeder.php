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
        DB::table("apps")->insert([ "id" => 2, "code" => "arf", "name" => "AutoRefresh", "description" => "Online AutoRefresh", ]); 
        
    }
}
