<?php

use Illuminate\Database\Seeder;
use App\UomNormalization;

class UomNormalizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $normalizations = [
            // ==================== LENGTH ====================
            ['raw_uom_code' => 'meter', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'meters', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'met', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'metr', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mtr', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'm', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mtr', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'm\'', 'uom_code' => 'm', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'centimeter', 'uom_code' => 'cm', 'language' => 'en', 'is_indonesian_specific' => 0],

            ['raw_uom_code' => 'cent', 'uom_code' => 'cm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'centi', 'uom_code' => 'cm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'centimet', 'uom_code' => 'cm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'cm', 'uom_code' => 'cm', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'millimeter', 'uom_code' => 'mm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mill', 'uom_code' => 'mm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'milli', 'uom_code' => 'mm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mili', 'uom_code' => 'mm', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mm', 'uom_code' => 'mm', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'kilometer', 'uom_code' => 'km', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'km', 'uom_code' => 'km', 'language' => 'en', 'is_indonesian_specific' => 0],

            // ==================== AREA ====================
            ['raw_uom_code' => 'm2', 'uom_code' => 'm2', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'sqm', 'uom_code' => 'm2', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'square meter', 'uom_code' => 'm2', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'square meters', 'uom_code' => 'm2', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'meter persegi', 'uom_code' => 'm2', 'language' => 'id', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'meter kuadrat', 'uom_code' => 'm2', 'language' => 'id', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'cm2', 'uom_code' => 'cm2', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'cm²', 'uom_code' => 'cm2', 'language' => 'en', 'is_indonesian_specific' => 0],

            // ==================== VOLUME ====================
            ['raw_uom_code' => 'm3', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'm³', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'cubic meter', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'cubic meters', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'qubic meter', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'qubic meters', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'qubic', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'qibic', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'qibik', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'kibik', 'uom_code' => 'm3', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'meter kubik', 'uom_code' => 'm3', 'language' => 'id', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'meter kibik', 'uom_code' => 'm3', 'language' => 'id', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'liter', 'uom_code' => 'l', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'litre', 'uom_code' => 'l', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'l', 'uom_code' => 'l', 'language' => 'en', 'is_indonesian_specific' => 0],

            // ==================== WEIGHT ====================
            ['raw_uom_code' => 'kilogram', 'uom_code' => 'kg', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'kilo', 'uom_code' => 'kg', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'kg', 'uom_code' => 'kg', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'gram', 'uom_code' => 'gr', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'grm', 'uom_code' => 'gr', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'gr', 'uom_code' => 'gr', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'ton', 'uom_code' => 'ton', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'tons', 'uom_code' => 'ton', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'tns', 'uom_code' => 'ton', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'tonne', 'uom_code' => 'ton', 'language' => 'en', 'is_indonesian_specific' => 0],

            // ==================== COUNT/PIECES ====================
            ['raw_uom_code' => 'piece', 'uom_code' => 'pcs', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'pieces', 'uom_code' => 'pcs', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'pcs', 'uom_code' => 'pcs', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'pc', 'uom_code' => 'pcs', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'buah', 'uom_code' => 'bh', 'language' => 'id', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'bh', 'uom_code' => 'bh', 'language' => 'id', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'biji', 'uom_code' => 'bj', 'language' => 'id', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'unit', 'uom_code' => 'unit', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'units', 'uom_code' => 'unit', 'language' => 'en', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'set', 'uom_code' => 'set', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'sets', 'uom_code' => 'set', 'language' => 'en', 'is_indonesian_specific' => 0],

            ['raw_uom_code' => 'pack', 'uom_code' => 'pack', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'pck', 'uom_code' => 'pack', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'pak', 'uom_code' => 'pack', 'language' => 'en', 'is_indonesian_specific' => 0],

            ['raw_uom_code' => 'box', 'uom_code' => 'box', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'boxes', 'uom_code' => 'box', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'boks', 'uom_code' => 'box', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'bok', 'uom_code' => 'box', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'bx', 'uom_code' => 'box', 'language' => 'en', 'is_indonesian_specific' => 0],

            ['raw_uom_code' => 'kantong', 'uom_code' => 'kantong', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'ktg', 'uom_code' => 'kantong', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'kant', 'uom_code' => 'kantong', 'language' => 'en', 'is_indonesian_specific' => 0],

            ['raw_uom_code' => 'org', 'uom_code' => 'org', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'orang', 'uom_code' => 'org', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'orng', 'uom_code' => 'org', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'oran', 'uom_code' => 'org', 'language' => 'id', 'is_indonesian_specific' => 1],

            // ==================== LUMP SUM ====================
            ['raw_uom_code' => 'ls', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lump sum', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lum sum', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lumpsump', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lumpsum', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lump', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lumps', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lumsum', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'lamsam', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'l.s', 'uom_code' => 'ls', 'language' => 'en', 'is_indonesian_specific' => 0],

            // ==================== TIME ====================
            ['raw_uom_code' => 'day', 'uom_code' => 'day(s)', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'days', 'uom_code' => 'day(s)', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'hari', 'uom_code' => 'day(s)', 'language' => 'id', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'week', 'uom_code' => 'week', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'weeks', 'uom_code' => 'week', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'minggu', 'uom_code' => 'week', 'language' => 'id', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'month', 'uom_code' => 'month', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mon', 'uom_code' => 'month', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'mth', 'uom_code' => 'month', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'months', 'uom_code' => 'month', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'bulan', 'uom_code' => 'month', 'language' => 'id', 'is_indonesian_specific' => 0],
            
            ['raw_uom_code' => 'hour', 'uom_code' => 'hour(s)', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'hours', 'uom_code' => 'hour(s)', 'language' => 'en', 'is_indonesian_specific' => 0],
            ['raw_uom_code' => 'jam', 'uom_code' => 'hour(s)', 'language' => 'id', 'is_indonesian_specific' => 0],

            // ==================== CONSTRUCTION-SPECIFIC (INDONESIAN) ====================
            ['raw_uom_code' => 'colt', 'uom_code' => 'colt', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'col', 'uom_code' => 'colt', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'kolt', 'uom_code' => 'colt', 'language' => 'id', 'is_indonesian_specific' => 1],

            ['raw_uom_code' => 'kijang', 'uom_code' => 'kijang', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'kjg', 'uom_code' => 'kijang', 'language' => 'id', 'is_indonesian_specific' => 1],

            ['raw_uom_code' => 'truk', 'uom_code' => 'truk', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'truck', 'uom_code' => 'truk', 'language' => 'id', 'is_indonesian_specific' => 1],

            ['raw_uom_code' => 'rit', 'uom_code' => 'rit', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'ritase', 'uom_code' => 'rit', 'language' => 'id', 'is_indonesian_specific' => 1],
            
            ['raw_uom_code' => 'zak', 'uom_code' => 'zak', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'sak', 'uom_code' => 'sak', 'language' => 'id', 'is_indonesian_specific' => 1],
            
            ['raw_uom_code' => 'lembar', 'uom_code' => 'lembar', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'lbr', 'uom_code' => 'lembar', 'language' => 'id', 'is_indonesian_specific' => 1],
            
            ['raw_uom_code' => 'batang', 'uom_code' => 'batang', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'btg', 'uom_code' => 'batang', 'language' => 'id', 'is_indonesian_specific' => 1],

            ['raw_uom_code' => 'point', 'uom_code' => 'point', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'pt', 'uom_code' => 'point', 'language' => 'id', 'is_indonesian_specific' => 1],
            ['raw_uom_code' => 'pts', 'uom_code' => 'point', 'language' => 'id', 'is_indonesian_specific' => 1],
            
        ];

        foreach ($normalizations as $normalization) {
            UomNormalization::updateOrCreate(
                ['raw_uom_code' => $normalization['raw_uom_code'] ?? $normalization['raw_value']],
                $normalization
            );
        }
    }
}
