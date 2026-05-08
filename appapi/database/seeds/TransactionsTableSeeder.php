<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Transaction;
use App\TransactionService;
use App\Branch;
use App\VehicleType;
use App\ServiceType;
use App\PaymentMethod;

class TransactionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1. Reset tables (order matters due to foreign keys)
        DB::table('transaction_services')->delete();
        DB::table('transactions')->delete();

        // 2. Prepare storage directory in public disk
        $targetSubDir = 'autorefresh';
        if (!Storage::disk('public')->exists($targetSubDir)) {
            Storage::disk('public')->makeDirectory($targetSubDir);
        }

        // 3. Prepare dummy images from existing public assets
        $sourceDir = public_path('img');
        $dummyImages = ['photo1.png', 'photo2.png', 'photo3.jpg', 'photo4.jpg'];
        $storedImages = [];

        foreach ($dummyImages as $imgName) {
            $sourcePath = $sourceDir . DIRECTORY_SEPARATOR . $imgName;
            if (File::exists($sourcePath)) {
                $extension = File::extension($sourcePath);
                $newName = 'dummy-' . Str::random(10) . '.' . $extension;
                $targetPath = $targetSubDir . '/' . $newName;
                
                // Copy file content using Laravel Storage
                Storage::disk('public')->put($targetPath, File::get($sourcePath));
                $storedImages[] = $targetPath;
            }
        }

        // 4. Get metadata for random association
        $branches = Branch::all();
        $vehicleTypes = VehicleType::all();
        $paymentMethods = PaymentMethod::all();
        
        if ($branches->isEmpty() || $vehicleTypes->isEmpty() || $paymentMethods->isEmpty()) {
            $this->command->error('Missing branches, vehicle types, or payment methods. Seed them first!');
            return;
        }

        $faker = \Faker\Factory::create('id_ID');

        // 5. Generate 30 transactions
        $this->command->info('Seeding 30 transactions...');
        
        for ($i = 0; $i < 30; $i++) {
            $branch = $branches->random();
            $vType = $vehicleTypes->random();
            $pMethod = $paymentMethods->random();
            
            // Random date in the last 60 days to populate history/reports
            $date = now()->subDays(rand(0, 60));
            $formattedDate = $date->format('Y-m-d');
            
            // Random Plate Number (e.g. B 1234 ABC)
            $plate = strtoupper($faker->bothify('? #### ???'));
            
            // Transaction number logic (Format: TRX-YYYYMMDD-XXXXX)
            $dateStr = $date->format('Ymd');
            $prefix = "TRX-{$dateStr}-";
            
            // Get last sequence for this date (within the loop to handle multiple entries per day)
            $last = Transaction::where('transaction_number', 'like', "{$prefix}%")
                ->orderByDesc('transaction_number')
                ->first();
            
            $seq = $last ? (int) substr($last->transaction_number, -5) + 1 : 1;
            $trxNumber = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);

            // Create Transaction Header
            $transaction = Transaction::create([
                'branch_id'         => $branch->id,
                'transaction_dt'    => $formattedDate,
                'transaction_number' => $trxNumber,
                'plate_number'      => $plate,
                'vehicle_type_id'   => $vType->id,
                'customer_name'     => $faker->name,
                'customer_phone'    => $faker->phoneNumber,
                'payment_method_id' => $pMethod->id,
                'transaction_photo' => $storedImages ? $storedImages[array_rand($storedImages)] : null,
                'created_by'        => 'seeder@autorefresh.id',
                'gross_total'       => 0, // To be calculated
                'discount'          => 0,
                'net_total'         => 0,
            ]);

            // Add 1-3 random services based on the vehicle type
            $servicesForType = ServiceType::where('vehicle_type_id', $vType->id)->get();
            if ($servicesForType->isNotEmpty()) {
                $takeCount = rand(1, min(3, $servicesForType->count()));
                $randomServices = $servicesForType->random($takeCount);
                $total = 0;
                
                foreach ($randomServices as $service) {
                    TransactionService::create([
                        'transaction_id'  => $transaction->id,
                        'service_type_id' => $service->id,
                        'service_price'   => $service->service_price,
                    ]);
                    $total += $service->service_price;
                }
                
                // Update transaction totals
                $transaction->update([
                    'gross_total' => $total,
                    'net_total'   => $total,
                ]);
            }
        }
        
        $this->command->info('Seeding completed successfully.');
    }
}
