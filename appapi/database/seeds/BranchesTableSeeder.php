<?php

use Illuminate\Database\Seeder;

class BranchesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $branches = [
            [
                'branch_code'      => 'BR-001',
                'branch_name'      => 'Pusat',
                'branch_address'   => 'Cianjur',
                'branch_phone'     => '021-1234567',
                'branch_email'     => 'main@autorefresh.id',
                'branch_logo'      => null,
                'branch_latitude'  => '-6.208763',
                'branch_longitude' => '106.845599',
                'is_active'        => 1,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            // [
            //     'branch_code'      => 'BR-002',
            //     'branch_name'      => 'Cabang 1',
            //     'branch_address'   => 'Depok',
            //     'branch_phone'     => '021-7654321',
            //     'branch_email'     => 'kuningan@autorefresh.id',
            //     'branch_logo'      => null,
            //     'branch_latitude'  => '-6.230867',
            //     'branch_longitude' => '106.831573',
            //     'is_active'        => 1,
            //     'created_at'       => now(),
            //     'updated_at'       => now(),
            // ],
            // [
            //     'branch_code'      => 'BR-003',
            //     'branch_name'      => 'Cabang 2',
            //     'branch_address'   => 'Bogor',
            //     'branch_phone'     => '021-4433221',
            //     'branch_email'     => 'kelapagading@autorefresh.id',
            //     'branch_logo'      => null,
            //     'branch_latitude'  => '-6.160048',
            //     'branch_longitude' => '106.909897',
            //     'is_active'        => 1,
            //     'created_at'       => now(),
            //     'updated_at'       => now(),
            // ],
        ];

        foreach ($branches as $branch) {
            DB::table('branches')->updateOrInsert(
                ['branch_code' => $branch['branch_code']],
                $branch
            );
        }
    }
}
