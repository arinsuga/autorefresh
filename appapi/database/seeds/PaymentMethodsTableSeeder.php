<?php

use Illuminate\Database\Seeder;

class PaymentMethodsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $paymentMethods = [
            [
                'payment_method_code' => 'PM-CASH',
                'payment_method_name' => 'Cash',
                'is_active'           => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'payment_method_code' => 'PM-CC',
                'payment_method_name' => 'Credit Card',
                'is_active'           => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'payment_method_code' => 'PM-DC',
                'payment_method_name' => 'Debit Card',
                'is_active'           => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'payment_method_code' => 'PM-TF',
                'payment_method_name' => 'Transfer',
                'is_active'           => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
        ];

        DB::table('payment_methods')->insert($paymentMethods);
    }
}
