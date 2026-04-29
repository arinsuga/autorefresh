<?php

namespace App\Http\Controllers\Absen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Arins\Services\Locater\LocaterInterface;
use Illuminate\Support\Facades\Auth;

use Arins\Facades\Response;
use Arins\Facades\Filex;
use Arins\Facades\Formater;
use Arins\Facades\ConvertDate;
use Arins\Facades\Role;
use Arins\Fo\Repositories\Attend\AttendRepositoryInterface;
use Arins\Bo\Repositories\User\UserRepositoryInterface;
use Carbon\Carbon;

//TODO: Sementara saja, nanti pakai repository
use Arins\Fo\Models\Attend;
use App\User;

class AbsenController extends Controller
{
    protected $sViewRoot;
    protected $data, $dataUsers;
    protected $oLocater;
    protected $ip;
    protected $baseURL, $latlng, $key;
    protected $viewModel;
    protected $uploadDirectory;

    /**
     * Create a new controller instance.
     *
     * Method Name: Constructor
     * 
     * @return void
     */
    public function __construct($psViewRoot = 'fo.absen',
    AttendRepositoryInterface $parData,
    UserRepositoryInterface $parDataUsers,
    LocaterInterface $poLocater)
    {
        // $this->middleware('auth');
        // $this->middleware('check.role:dnb-super,hrd-admin,dnb-admin')
        // ->only('checkHistoryAdmin');

        $this->uploadDirectory = 'checkpoint';
        $this->sViewRoot = $psViewRoot;
        $this->data = $parData;
        $this->dataUsers = $parDataUsers;
        $this->oLocater = $poLocater;
        
        //$this->middleware('auth');
        $this->middleware('authjwt');

        //#HCD: Set NULL for production
        $this->ip = null; //Production

        $this->baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
        $this->latlng = null;
        $this->key = '&key=' . env('GEOCODING_APIKEY');

    }

    protected function getFullURL($latitude, $longitude)
    {
        $this->latlng = 'latlng=' . $latitude . ',' . $longitude;

        return $fullURL = $this->baseURL . $this->latlng . $this->key;
    } //end method

    protected function setCity($parData)
    {
        $data = $parData;
        $cityLevel1 = null;
        $cityLevel2 = null;
        $nCount = 0;

        foreach ($data->results[0]->address_components as $key => $component) {

            if ($nCount >= 2)
            {
                break;
            } //end if

            foreach ($component->types as $item) {

                if ($nCount >= 2)
                {
                    break;
                } //end if

                //City Level 1
                if ($item == 'administrative_area_level_1')
                {
                    $cityLevel1 = $component->short_name;
                    $nCount++;
                } //end if

                //City Level 2
                if ($item == 'administrative_area_level_2')
                {
                    $cityLevel2 = $component->short_name;
                    $nCount++;
                } //end if

            } //end loop

        } //end loop

        return $cityLevel2;
    }

    protected function setAddress($parData)
    {
        $data = $parData;
        return $data->results[0]->formatted_address;
    }


    public function show($id)
    {

        $attend = $this->data->find($id);

        $data = [

            'attend' => $attend,
            'user' => $attend->user,

        ];

        $viewModel = Response::viewModel($data);

        // return view($this->sViewRoot.'.show',
        // ['viewModel' => $viewModel]);

        return response()->json($viewModel);

    }
    
    //Check
    public function check($email)
    {

        // if (Role::deny(Auth::user()->roles, 'hrd-admin')) {

        //     //todo: change not authorized return redirect()->route('absen.history.admin');

        // } //end if
        
        // $user = Auth::user();
        $user = User::where('email', $email)->first();
        $date = Formater::date(now());
        $dateIso = ConvertDate::strDateToDate($date);

        $attend = $this->data->getOutstandingCheckoutByUserId($user->id);



        if (!$attend) {
            $attend = $this->data->getAttendancesByUserIdAndDate($user->id, $dateIso);
        } //end if
        
        $action = 'checkin';
        $actionButton = 'Checkin';
        
        $data = null;
        $data = [
            'action' => $action,
            'action_button' => $actionButton,
            'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'dept' => $user->dept,
                        'attend_id' => null,

                        'checkin_time' => null,
                        'checkin_city' => null,
                        'checkin_address' => null,
                        'checkin_image' => null,
                        'checkin_title' => null,
                        'checkin_subtitle' => null,
                        'checkin_description' => null,

                        'checkout_time' => null,
                        'checkout_city' => null,
                        'checkout_address' => null,
                        'checkout_image' => null,
                        'checkout_title' => null,
                        'checkout_subtitle' => null,
                        'checkout_description' => null,
                    ],
            'date' => null
        ];
        // if ($attend != null)
        if (count($attend) >= 1) {
            $attends = $attend;
            $attend = null;
            foreach ($attends as $item) {
                if ( ($item->checkin_time) && (!$item->checkout_time) ) {
                    
                    $action = 'checkout';
                    $actionButton = 'Checkout';
                    $attend = $item;
                    break;

                } //end if
            } //end loop

            if ($attend)
            {
                $data = [
                    'action' => $action,
                    'action_button' => $actionButton,
                    'user' => [
                                'id' => $user->id,
                                'name' => $user->name,
                                'email' => $user->email,
                                'dept' => $user->dept,
                                'attend_id' => $attend->id,
                                
                                'checkin_time' => Formater::time($attend->checkin_time),
                                'checkin_city' => $attend->checkin_city,
                                'checkin_address' => $attend->checkin_address,
                                'checkin_image' => $attend->checkin_image,
                                'checkin_title' => $attend->checkin_title,
                                'checkin_subtitle' => $attend->checkin_subtitle,
                                'checkin_description' => $attend->checkin_description,

                                'checkout_time' => Formater::time($attend->checkout_time),
                                'checkout_city' => $attend->checkout_city,
                                'checkout_address' => $attend->checkout_address,
                                'checkout_image' => $attend->checkout_image,
                                'checkout_title' => $attend->checkout_title,
                                'checkout_subtitle' => $attend->checkout_subtitle,
                                'checkout_description' => $attend->checkout_description,
                            ],
                    'date' => $date
                ];
            } //end if

        } //end if

        $viewModel = Response::viewModel($data);

        // return view($this->sViewRoot.'.check',
        // ['viewModel' => $viewModel]);

        return response()->json($viewModel);

    }

    protected function fillAttendList($userId=null, $attend_list=null)
    {
        $data = [];
        foreach ($attend_list as $key => $value) {

            if ($value->user_id == $userId) {

                $time_elapse1 = $value->checkin_time->diffInHours($value->checkout_time);
                $time_elapse2 = $value->checkin_time->diff($value->checkout_time)->format('%I:%S');
                $data[$key] = [
                    'id' => $value->id,
                    'user_id' => $value->user->id,
                    'name' => $value->user->name,

                    'attend_dt' => (!isset($value->attend_utctz)) ? '' :
                    Formater::dateMonth(ConvertDate::DatetimeByTimezone($value->attend_dt, $value->attend_utctz)),
             
                    'checkin_latitude' => $value->checkin_latitude,
                    'checkin_longitude' => $value->checkin_longitude,
                    'checkin_milliseconds' => (isset($value->checkin_time)) ? $value->checkin_time->timestamp*1000 : $value->checkin_time,
                    'checkin_datetime' => $value->checkin_time .
                    " ( " . ConvertDate::millisOffsetDesc($value->checkin_utcoffset) . " ) ",

                    'checkin_date' => (!isset($value->checkin_utctz)) ? '' :
                    Formater::date(ConvertDate::DatetimeByTimezone($value->checkin_time, $value->checkin_utctz)),
                    'checkin_time' => (!isset($value->checkin_utctz)) ? '' :
                    Formater::time(ConvertDate::DatetimeByTimezone($value->checkin_time, $value->checkin_utctz)) .
                    " ( " . ConvertDate::millisOffsetDesc($value->checkin_utcoffset) . " ) ",

                    'checkin_title' => $value->checkin_title,
                    'checkin_subtitle' => $value->checkin_subtitle,
                    'checkin_address' => $value->checkin_address,
                    'checkin_description' => $value->checkin_description,
                    'checkin_image' => (isset($value->checkin_image)) ? asset('storage/' . $value->checkin_image) : null,

                    'checkout_latitude' => $value->checkout_latitude,
                    'checkout_longitude' => $value->checkout_longitude,
                    'checkout_milliseconds' => (isset($value->checkout_time)) ? $value->checkout_time->timestamp*1000 : $value->checkout_time,
                    'checkout_datetime' => $value->checkout_time .
                    " ( " . ConvertDate::millisOffsetDesc($value->checkout_utcoffset) . " ) ",

                    'checkout_date' => (!isset($value->checkout_utctz)) ? '' :
                    Formater::date(ConvertDate::DatetimeByTimezone($value->checkout_time, $value->checkout_utctz)),
                    'checkout_time' => (!isset($value->checkout_utctz)) ? '' :
                    Formater::time(ConvertDate::DatetimeByTimezone($value->checkout_time, $value->checkout_utctz)) .
                    " ( " . ConvertDate::millisOffsetDesc($value->checkout_utcoffset) . " ) ",

                    'checkout_title' => $value->checkout_title,
                    'checkout_subtitle' => $value->checkout_subtitle,
                    'checkout_address' => $value->checkout_address,
                    'checkout_description' => $value->checkout_description,
                    'checkout_image' => (isset($value->checkout_image)) ?asset('storage/' . $value->checkout_image) : null,

                    'time_elapse' => $time_elapse1 . ':' . $time_elapse2,
                ];
    
            } //end if

        } //end loop

        return $data;
    }

    protected function history($userId=null, $checkpointDate1=null, $checkpointDate2=null)
    {
        $data = null;

        $user = User::find($userId);
        $data['user'] = [
            'name' => $user->name,
            'dept' => $user->dept
        ];

        $attends = $this->data->getAttendancesCustomFilter($userId, $checkpointDate1, $checkpointDate2);
        $attend_list = $attends->sortBy('attend_dt');

        
        $data['attend_list'] = $this->fillAttendList($userId, $attend_list);

       $this->viewModel = Response::viewArray($data);

       return $data;

    }

    //checkHistory
    public function checkHistory()
    {
        return view($this->sViewRoot.'.check-history');
    }

    //checkHistory
    public function checkHistoryAdmin()
    {
        return view($this->sViewRoot.'.check-history', [
            'admin' => true,
            'users' => $this->dataUsers->dnb()
        ]);
    }

    //checkHistoryPost
    public function checkHistoryPost(Request $request)
    {

        $selectedUsername = $request->input('username');

        try {

            $selectedUserId = User::where('email', $selectedUsername)->first()->id;

        } catch (\Throwable $th) {

            //throw $th;
            return response()->json(Response::viewModelError500('Data not found, Invalid Username'));

        }        



        $startdt = $request->input('startdt');
        $enddt = $request->input('enddt');
        $historyMedia = $request->input('history_media');

        $resultView = null;
        if ($historyMedia == 'view') {
            $resultView = 'check-history-view';
        } //end if

        if ($historyMedia == 'pdf') {
            $resultView = 'check-history-pdf';
        } //end if

        $startDateIso = ConvertDate::strDateToDate($startdt);
        $endDateIso = ConvertDate::strDateToDate($enddt);


        // return response()->json([
        //     'tes' => 'hasil',
        //     '$selectedUsername' => $selectedUsername,
        //     '$userId' => $userId,
        //     '$startdt' => $startdt,
        //     '$enddt' => $enddt,
        //     '$historyMedia' => $historyMedia,
        //     '$startDateIso' => $startDateIso,
        //     '$endDateIso' => $endDateIso,
        //     ]);


        $dd = $this->history($selectedUserId, $startDateIso, $endDateIso);

        if (isset($selectedUserId)) {

            return response()->json($this->viewModel);

        } //end if

        return response()->json($this->viewModel);
    }


    protected function historyByUserIdAndCheckpointDate($userId=null, $checkpointDate=null)
    {
        $data = null;

        $user = User::find($userId);
        $data['user'] = [
            'name' => $user->name,
            'dept' => $user->dept
        ];

        $attends = $this->data->getAttendancesByUserIdAndCheckpointDate($userId, $checkpointDate);
        $attend_list = $attends->sortBy('attend_dt');


        
        $data['attend_list'] = $this->fillAttendList($userId, $attend_list);

       $this->viewModel = Response::viewArray($data);

       return $data;

    }

    //postHistoryByUserIdAndCheckpointDate
    public function postHistoryByUserIdAndCheckpointDate(Request $request)
    {
        $selectedUsername = $request->input('username');
        try {

            //code...
            $selectedUserId = User::where('email', $selectedUsername)->first()->id;

        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(Response::viewModelError500('Data not found, Invalid Username'));


        }        

        $checkpointDate = $request->input('checkpoint_date');
        $historyMedia = $request->input('history_media');

        $resultView = null;
        if ($historyMedia == 'view') {
            $resultView = 'check-history-view';
        } //end if

        if ($historyMedia == 'pdf') {
            $resultView = 'check-history-pdf';
        } //end if

        $checkpointDateIso = ConvertDate::strDateToDate($checkpointDate);


        $dd = $this->historyByUserIdAndCheckpointDate($selectedUserId, $checkpointDateIso);

        if (isset($selectedUserId)) {
        
            return response()->json($this->viewModel);

        } //end if

        return response()->json($this->viewModel);
    }

    /**
     * Method Name: checkHistory
     * 
     * http method: GET
     * 
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkHistoryPdf()
    {
        $user = Auth::user();

        $date = Formater::date(now());
        $dateIso = ConvertDate::strDateToDate($date);

        $this->history($user->id, $dateIso);

        return view($this->sViewRoot.'.check-history-pdf',
        ['viewModel' => $this->viewModel]);
    }

    /**
     * Method Name: store
     * 
     * http method: POST
     * 
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkin(Request $request)
    {

        $authUser = Auth::user();
        $attend = new Attend();
        
        $client = $request->input('client');
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $upload = $request->file('upload'); //upload file (image/document) ==> if included
        $imageTemp = $request->input('imageTemp'); //temporary file uploaded

        //Get UTC
        $utc_tz = $request->input('utc_tz');
        $utc_millis = $request->input('utc_millis');
        $utc_offset = $request->input('utc_offset');

        //validasi location
        if (!isset($latitude) || !isset($longitude)) {

            return response()->json([
                'status_failed' => 'CHECKIN GAGAL - Data Lokasi tidak dilampirkan',
                'checkout_description' => $request->input('checkout_description'),
            ], 500);

        } //end if
        
        //validasi upload foto mandatory
        // if (!isset($upload)) {

        //     return response()->json([
        //         'status_failed' => 'CHECKIN GAGAL - Foto harus dilampirkan',
        //         'checkin_description' => $request->input('checkin_description'),
        //     ], 500);
            
            
        // } //end if

        //validasi Timezone
        if (!isset($utc_tz) || !isset($utc_millis) || !isset($utc_offset)) {

            return response()->json([
                'status_failed' => 'CHECKIN GAGAL - Informasi Timezone harus dilampirkan',
                'checkin_description' => $request->input('checkin_description'),
            ], 500);
                                
        } //end if

        $host = $this->getFullURL($latitude, $longitude);
        $data = $this->oLocater->locate($host);


        //convert to JSON
        if ( ($data) && ($data->results) ) {

            if (isset($upload)) {

                //create temporary uploaded image
                $uploadTemp = Filex::uploadTemp($upload, $imageTemp, null, 'checkin');

                //copy temporary uploaded image to real path
                $checkin_image = Filex::uploadOrCopyAndRemove('', $uploadTemp, $this->uploadDirectory, $upload, 'public', false, 'checkin');

            }

        // return response()->json([
        //     'aftertes' => 'aftertes',
        //     'uploadTemp' => $uploadTemp
        // ]);


            $attend->user_id = $authUser->id;

            $attend->attend_dt = now();
            $attend->attend_utctz = $utc_tz;
            $attend->attend_utcmillis = $utc_millis;
            $attend->attend_utcoffset = $utc_offset;

            $attend->checkin_time = now();
            $attend->checkin_city = $this->setCity($data);
            $attend->checkin_address = $this->setAddress($data);
            $attend->checkin_latitude = $latitude;
            $attend->checkin_longitude = $longitude;

            $attend->checkin_utctz = $utc_tz;
            $attend->checkin_utcmillis = $utc_millis;
            $attend->checkin_utcoffset = $utc_offset;

            $attend->checkin_ip = null;
            $attend->checkin_metadata = json_encode($data);

            if (isset($checkin_image)) {

                $attend->checkin_image = $checkin_image;

            }
            
            $attend->checkin_title = $request->input('checkin_title');
            $attend->checkin_subtitle = $request->input('checkin_subtitle');
            $attend->checkin_description = $request->input('checkin_description');
            $attend->checkin_client = $client;
            

            $attend->save();

            $response = [
                'message' => 'data checkin absensi tersimpan',
                'result' => $data,
                'metadata' => json_encode($data)
            ];
    
            return response()->json($response, 200);
    
        } //end if

        return response()->json([
            'status_failed' => 'CHECKIN GAGAL - Kontak admin untuk informasi lebih lanjut',
            'checkin_description' => '',
        ], 500);

    }

    /**
     * Method Name: store
     * 
     * http method: POST
     * 
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkout(Request $request)
    {


        $data = null;
        $attend = Attend::find($request->input('attend_id'));

        $tesData = [
            'attend_id' => $request->input('attend_id'),
            'attend' => (array)$attend
        ];

        if ($attend)
        {

            $client = $request->input('client');
            $latitude = $request->input('latitude');
            $longitude = $request->input('longitude');
            $upload = $request->file('upload'); //upload file (image/document) ==> if included
            $imageTemp = $request->input('imageTemp'); //temporary file uploaded

            //Get UTC
            $utc_tz = $request->input('utc_tz');
            $utc_millis = $request->input('utc_millis');
            $utc_offset = $request->input('utc_offset');

            //validasi location
            if (!isset($latitude) || !isset($longitude)) {

                return response()->json([
                    'status_failed' => 'CHECKOUT GAGAL - Data Lokasi tidak dilampirkan',
                    'checkout_description' => $request->input('checkout_description'),
                ], 500);

            } //end if

            //validasi upload foto mandatory
            // if (!isset($upload)) {

            //     return response()->json([
            //         'status_failed' => 'CHECKOUT GAGAL - Foto harus dilampirkan',
            //         'checkout_description' => $request->input('checkout_description'),
            //     ], 500);

            // } //end if

            //validasi Timezone
            if (!isset($utc_tz) || !isset($utc_millis) || !isset($utc_offset)) {

                return response()->json([
                    'status_failed' => 'CHECKOUT GAGAL - Informasi Timezone harus dilampirkan',
                    'checkout_description' => $request->input('checkout_description'),
                ], 500);

            } //end if

        
            $host = $this->getFullURL($latitude, $longitude);
            $data = $this->oLocater->locate($host);

            if ( ($data) && ($data->results) ) {


                if (isset($upload)) {

                    //create temporary uploaded image
                    $uploadTemp = Filex::uploadTemp($upload, $imageTemp, null, 'checkin');

                    //copy temporary uploaded image to real path
                    $checkout_image = Filex::uploadOrCopyAndRemove('', $uploadTemp, $this->uploadDirectory, $upload, 'public', false, 'checkout');

                }

                
                $attend->checkout_time = now();
                $attend->checkout_city = $this->setCity($data);
                $attend->checkout_address = $this->setAddress($data);
                $attend->checkout_latitude = $latitude;
                $attend->checkout_longitude = $longitude;

                $attend->checkout_utctz = $utc_tz;
                $attend->checkout_utcmillis = $utc_millis;
                $attend->checkout_utcoffset = $utc_offset;

                $attend->checkout_ip = null;
                $attend->checkout_metadata = json_encode($data);

                if (isset($checkout_image)) {

                    $attend->checkout_image = $checkout_image;
                    
                }

                $attend->checkout_title = $request->input('checkout_title');
                $attend->checkout_subtitle = $request->input('checkout_subtitle');
                $attend->checkout_description = $request->input('checkout_description');
                $attend->checkout_client = $client;


                $attend->save();

                $response = [
                    'message' => 'data checkout absensi tersimpan',
                    'result' => $data,
                    'metadata' => json_encode($data)
                ];
        
                return response()->json($response, 200);
    
            } //end if

        } //end if

        return response()->json([
            'status_failed' => 'CHECKOUT GAGAL - Kontak admin untuk informasi lebih lanjut',
            'checkout_description' => '',
        ], 500);

    } //end method

} //end method
