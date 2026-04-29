<?php

namespace Arins\Services\Converter\Date;

use Carbon\Carbon;

trait ConvertDateToDate
{
    /**
     * ======================================================
     * 1. Timezone 2 Methods
     * ====================================================== */
    public function DatetimeByTimezone($data, $timezone)
    {

        if (isset($timezone)) {

            return $data->copy()->setTimezone($timezone);
            
        }

        return $data->copy();
        
    }

}
