<?php
namespace Arins\Services\Converter\Date;

interface ConvertMillisToDateInterface
{
    /**
     * ======================================================
     * 1. Timezone 2 Methods
     * ====================================================== */
    public function millisToDatetime($data, $offset = 0);
    public function millisOffsetDesc($data);
}
