<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsAttendsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('attends', function (Blueprint $table) {

            $table->integer('attend_utcoffset')->nullable()->after('attend_dt');
            $table->bigInteger('attend_utcmillis')->nullable()->after('attend_dt');
            $table->string('attend_utctz')->nullable()->after('attend_dt');

            $table->integer('checkin_utcoffset')->nullable()->after('checkin_time');
            $table->bigInteger('checkin_utcmillis')->nullable()->after('checkin_time');
            $table->string('checkin_utctz')->nullable()->after('checkin_time');
            $table->string('checkin_client', 50)->nullable()->after('attend_utcoffset');
            
            $table->integer('checkout_utcoffset')->nullable()->after('checkout_time');
            $table->bigInteger('checkout_utcmillis')->nullable()->after('checkout_time');
            $table->string('checkout_utctz')->nullable()->after('checkout_time');
            $table->string('checkout_client', 50)->nullable()->after('checkin_description');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('attends', function (Blueprint $table) {

            $table->dropColumn('attend_utcoffset');
            $table->dropColumn('attend_utcmillis');
            $table->dropColumn('attend_utctz');
            
            $table->dropColumn('checkin_client');
            $table->dropColumn('checkin_utcoffset');
            $table->dropColumn('checkin_utcmillis');
            $table->dropColumn('checkin_utctz');

            $table->dropColumn('checkout_client');
            $table->dropColumn('checkout_utcoffset');
            $table->dropColumn('checkout_utcmillis');
            $table->dropColumn('checkout_utctz');


        });

    }
}
