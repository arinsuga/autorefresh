<?php

namespace App\Constants;

class Roles
{
    public static function master()
    {
        return env('ROLE_MASTER', 'masterrole');
    }

    public static function super()
    {
        return env('ROLE_SUPER', 'superrole');
    }

    public static function admin()
    {
        return env('ROLE_ADMIN', 'adminrole');
    }

    public static function user()
    {
        return env('ROLE_USER', 'userrole');
    }
}
