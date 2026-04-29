<?php
namespace Arins\Services\Response;

interface ResponseInterface
{
    public function viewModel($parData);
    public function viewJson($parData);
    public function viewArray($parData);

    public function viewModelError500($parMessage);
    public function viewJsonError500($parMessage);
    public function viewArrayError500($parMessage);
    
}
