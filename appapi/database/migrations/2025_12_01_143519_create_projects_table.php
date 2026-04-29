<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('project_name');
            $table->string('project_description')->nullable();
            $table->string('project_owner')->nullable();
            $table->string('project_pic')->nullable();
            $table->string('project_number')->nullable();
            $table->date('project_startdt')->nullable();
            $table->date('project_enddt')->nullable();

            $table->string('project_address')->nullable();
            $table->string('project_latitude')->nullable();
            $table->string('project_longitude')->nullable();
            $table->integer('projectstatus_id')->default(0); // 0=Open, 1=approved, 2=Closed, 3=Canceled/Rejected, 4=Pending
            $table->boolean('is_active')->default(1); // Active/inactive flag
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}
