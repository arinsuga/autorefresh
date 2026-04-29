<?php

namespace Arins\Services\Response;

use Arins\Services\Response\ResponseAbstract;
use Arins\Services\Response\ResponseInterface;

class Response extends ResponseAbstract
               implements ResponseInterface
{
    public function viewModel($parData = null, $parFormAction = null)
    {
        return $this->toObject(
            config('response.status.ok', true),
            config('response.code.ok.number', 200), 
            config('response.code.ok.message', 'OK'),
            null,
            $parData,
            $parFormAction
        );
    }

    public function viewJson($parData = null, $parFormAction = null)
    {
        return $this->toJson(
            config('response.status.ok', true),
            config('response.code.ok.number', 200), 
            config('response.code.ok.message', 'OK'),
            null,
            $parData,
            $parFormAction
        );
    }

    public function viewArray($parData = null, $parFormAction = null)
    {
        return $this->toArray(
            config('response.status.ok', true),
            config('response.code.ok.number', 200), 
            config('response.code.ok.message', 'OK'),
            null,
            $parData,
            $parFormAction
        );
    }

/** ========================= */

    public function viewModelError500($parMessage = 'Internal Server Error')
    {
        return $this->toObject(
            config('response.status.internalservererror', false),
            config('response.code.internalservererror.number', 500), 
            config('response.code.internalservererror.message', 'Internal Server Error'),
            $parMessage
        );
    }

    public function viewJsonError500($parMessage = 'Internal Server Error')
    {
        return $this->toJson(
            config('response.status.internalservererror', false),
            config('response.code.internalservererror.number', 500), 
            config('response.code.internalservererror.message', 'Internal Server Error'),
            $parMessage
        );
    }

    public function viewArrayError500($parMessage = 'Internal Server Error')
    {
        return $this->toArray(
            config('response.status.internalservererror', false),
            config('response.code.internalservererror.number', 500), 
            config('response.code.internalservererror.message', 'Internal Server Error'),
            $parMessage
        );
    }


}
