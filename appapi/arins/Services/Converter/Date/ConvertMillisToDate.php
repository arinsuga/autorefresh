<?php

namespace Arins\Services\Converter\Date;

use Carbon\Carbon;

trait ConvertMillisToDate
{
    /**
     * ======================================================
     * 1. Timezone 2 Methods
     * ====================================================== */
    public function millisToDatetime($data, $offset = 0)
    {

        $millis = $data + ($offset * 3600000);
        return Carbon::createFromTimestampMs($millis);
        
    }

    public function millisOffsetDesc($data)
    {

        if (isset($data)) {
    
            return config('a1.date.timezoneinfo.' . ($data) .'.offset');

        }

        return 'GMT+00:00';
    }

}
