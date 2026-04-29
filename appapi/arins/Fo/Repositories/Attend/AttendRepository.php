<?php

namespace Arins\Fo\Repositories\Attend;

use Arins\Repositories\Data\EloquentRepository;
use Arins\Fo\Repositories\Attend\AttendRepositoryInterface;

class AttendRepository extends EloquentRepository implements AttendRepositoryInterface
{
    protected $attend;

    public function getAttendanceByUserIdAndDate($parUserId, $parAttend_dt = null)
    {

        $result = $this->data->where('user_id', $parUserId)
                   ->where('attend_dt', $parAttend_dt->toDateString())
                   ->first();

        return $result;
    }

    public function getAttendancesByUserIdAndDate($parUserId, $parAttend_dt = null)
    {

        $result = $this->data->where('user_id', $parUserId)
                   ->where('attend_dt', $parAttend_dt->toDateString())
                   ->get();

        return $result;
    }

    public function getAttendancesCustomFilter(
        $parUserId=null, $parCheckpoint_dt1=null, $parCheckpoint_dt2=null)
    {

        $checkin_time = 'checkin_time';
        $checkout_time = 'checkout_time';
        $result = $this->data;

        if (isset($parUserId)) {
            $result = $result->where('user_id', $parUserId);
        } //end if

        if (isset($parCheckpoint_dt1) && !isset($parCheckpoint_dt2)) {

            $result = $result->where($checkin_time, '>=', $parCheckpoint_dt1);
            $result = $result->orWhere($checkout_time, '>=', $parCheckpoint_dt1);
            
        } //end if

        if (isset($parCheckpoint_dt1) && isset($parCheckpoint_dt2)) {

            // if ($parCheckpoint_dt1 == $parCheckpoint_dt2) {

            //     $result = $result->where($checkin_time, '>=', $parCheckpoint_dt1);
            //     $result = $result->orWhere($checkout_time, '>=', $parCheckpoint_dt1);


            // } //end if

            // if ($parCheckpoint_dt1 < $parCheckpoint_dt2) {

            //     $result = $result->whereBetween($checkin_time, [$parCheckpoint_dt1, $parCheckpoint_dt2]);
            //     $result = $result->orWhereBetween($checkout_time, [$parCheckpoint_dt1, $parCheckpoint_dt2]);

            // }

            $result = $result->whereRaw("(DATE(checkin_time) >= ? and DATE(checkin_time) <= ?) or (DATE(checkout_time) >= ? and DATE(checkout_time) <= ?)",
            [$parCheckpoint_dt1->toDateString(), $parCheckpoint_dt2->toDateString(), $parCheckpoint_dt1->toDateString(), $parCheckpoint_dt2->toDateString()]);
            
        } //end if

        // return $result->toSql();

        return $result->get();
    }

    public function getAttendancesByUserIdAndCheckpointDate(
        $parUserId=null, $parCheckpoint_dt)
    {

        $checkin_time = 'checkin_time';
        $checkout_time = 'checkout_time';
        $result = $this->data;



        if (isset($parUserId)) {
            $result = $result->where('user_id', $parUserId);
            } else {
            return null;
        } //end if

        if (isset($parCheckpoint_dt)) {

            $result = $result->whereDate($checkin_time,$parCheckpoint_dt);
            $result = $result->orWhereDate($checkout_time,$parCheckpoint_dt);
            
        } //end if


        return $result->get();
    }

    public function getOutstandingCheckoutByUserId($parUserId)
    {

        $result = $this->data->where('user_id', $parUserId)
                   ->where('checkin_time', '!=', null)
                   ->where('checkout_time', null)
                   ->orderBy('id','desc')
                   ->get();

        return $result;
    }

}