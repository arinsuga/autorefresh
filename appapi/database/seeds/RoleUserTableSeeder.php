<?php

use Illuminate\Database\Seeder;

class RoleUserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /** Reset table */
        DB::table('role_user')->delete();

        /** Master Users */
        DB::table("role_user")->insert([ "id" => 1, "app_id" => 1, "role_id" => 1, "user_id" => 1, "created_at" => null, "updated_at" => null, ]); 

        /** Checkpoint Production Users */
        DB::table("role_user")->insert([ "id" => 103, "app_id" => 4, "role_id" => 14, "user_id" => 56,  "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 104, "app_id" => 4, "role_id" => 14, "user_id" => 67,  "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 105, "app_id" => 4, "role_id" => 14, "user_id" => 149, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 101, "app_id" => 4, "role_id" => 11, "user_id" => 200, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 106, "app_id" => 4, "role_id" => 14, "user_id" => 200, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 102, "app_id" => 4, "role_id" => 16, "user_id" => 257, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 107, "app_id" => 4, "role_id" => 14, "user_id" => 329, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 108, "app_id" => 4, "role_id" => 14, "user_id" => 330, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 109, "app_id" => 4, "role_id" => 14, "user_id" => 331, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 110, "app_id" => 4, "role_id" => 14, "user_id" => 332, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 111, "app_id" => 4, "role_id" => 14, "user_id" => 333, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 112, "app_id" => 4, "role_id" => 14, "user_id" => 334, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 113, "app_id" => 4, "role_id" => 14, "user_id" => 335, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 114, "app_id" => 4, "role_id" => 14, "user_id" => 336, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 115, "app_id" => 4, "role_id" => 14, "user_id" => 337, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 116, "app_id" => 4, "role_id" => 14, "user_id" => 338, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 117, "app_id" => 4, "role_id" => 14, "user_id" => 339, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 118, "app_id" => 4, "role_id" => 14, "user_id" => 340, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 119, "app_id" => 4, "role_id" => 14, "user_id" => 341, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 120, "app_id" => 4, "role_id" => 14, "user_id" => 342, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 121, "app_id" => 4, "role_id" => 14, "user_id" => 343, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 122, "app_id" => 4, "role_id" => 14, "user_id" => 344, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 123, "app_id" => 4, "role_id" => 14, "user_id" => 345, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 124, "app_id" => 4, "role_id" => 14, "user_id" => 346, "created_at" => null, "updated_at" => null ]);
        DB::table("role_user")->insert([ "id" => 125, "app_id" => 4, "role_id" => 14, "user_id" => 347, "created_at" => null, "updated_at" => null ]);

        /** Cost Control Production Users */
        DB::table("role_user")->insert([ "id" => 126, "app_id" => 2, "role_id" => 4, "user_id" => 501, "created_at" => null, "updated_at" => null, ]);
        DB::table("role_user")->insert([ "id" => 127, "app_id" => 2, "role_id" => 4, "user_id" => 502, "created_at" => null, "updated_at" => null, ]);
        DB::table("role_user")->insert([ "id" => 128, "app_id" => 2, "role_id" => 4, "user_id" => 503, "created_at" => null, "updated_at" => null, ]);

        /** Basic Users - Cost Control */
        // cct-super : sa
        DB::table("role_user")->insert([ "id" => 301, "app_id" => 2, "role_id" => 2, "user_id" => 2, "created_at" => null, "updated_at" => null, ]);
        // cct-admin: admin
        DB::table("role_user")->insert([ "id" => 302, "app_id" => 2, "role_id" => 3, "user_id" => 3, "created_at" => null, "updated_at" => null, ]);
        // cct-user: John
        DB::table("role_user")->insert([ "id" => 303, "app_id" => 2, "role_id" => 4, "user_id" => 4, "created_at" => null, "updated_at" => null, ]);
        // cct-user: Lisa
        DB::table("role_user")->insert([ "id" => 304, "app_id" => 2, "role_id" => 4, "user_id" => 5, "created_at" => null, "updated_at" => null, ]);

        /** Basic Users - Checkpoint */
        // cct-super : sa
        DB::table("role_user")->insert([ "id" => 305, "app_id" => 4, "role_id" => 2, "user_id" => 2, "created_at" => null, "updated_at" => null, ]);
        // cct-admin: admin
        DB::table("role_user")->insert([ "id" => 306, "app_id" => 4, "role_id" => 3, "user_id" => 3, "created_at" => null, "updated_at" => null, ]);
        // cct-user: John
        DB::table("role_user")->insert([ "id" => 307, "app_id" => 4, "role_id" => 4, "user_id" => 4, "created_at" => null, "updated_at" => null, ]);
        // cct-user: Lisa
        DB::table("role_user")->insert([ "id" => 308, "app_id" => 4, "role_id" => 4, "user_id" => 5, "created_at" => null, "updated_at" => null, ]);

    }
}
