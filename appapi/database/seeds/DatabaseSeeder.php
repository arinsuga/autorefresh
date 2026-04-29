<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

		/** uncomment if you want integrated authentication */
        // $this->call('AppsTableSeeder');
        // $this->call('RolesTableSeeder');
        // $this->call('AppUserTableSeeder');
        // $this->call('RoleUserTableSeeder');

        $this->call('UomNormalizationSeeder');
        $this->call('RefftypesTableSeeder');
        $this->call('SheetgroupsTableSeeder');
        $this->call('VendortypesTableSeeder');

        $this->call('ProjectstatusesTableSeeder');
        $this->call('ContractstatusesTableSeeder');
        $this->call('OrderstatusesTableSeeder');
        $this->call('ExpenseStatusesTableSeeder');

        // AutoRefresh seeders
        $this->call('BranchesTableSeeder');
        $this->call('VehicleTypesTableSeeder');
        $this->call('ServiceTypesTableSeeder');
        $this->call('PaymentMethodsTableSeeder');

    }
}
