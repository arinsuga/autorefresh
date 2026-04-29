<?php

namespace App\Repositories;

use App\Repositories\Data\EloquentRepository;
use App\Repositories\Contracts\ContractSheetRepositoryInterface;

class ContractSheetRepository extends EloquentRepository implements ContractSheetRepositoryInterface
{
    public function __construct(\App\ContractSheet $data)
    {
        parent::__construct($data);
    }

    public function create($parData)
    {
        return parent::create($parData);
    }

    public function bulkCreate($parData)
    {
        $sheetGroupIds = collect($parData)->pluck('sheetgroup_id')->filter()->unique();
        if ($sheetGroupIds->isNotEmpty()) {
            $sheetGroups = \App\SheetGroup::whereIn('id', $sheetGroupIds)->get()->keyBy('id');
            
            $parData = collect($parData)->map(function ($item) use ($sheetGroups) {
                if (isset($item['sheetgroup_id']) && isset($sheetGroups[$item['sheetgroup_id']])) {
                    $item['sheetgroup_seqno'] = $sheetGroups[$item['sheetgroup_id']]->sheetgroup_seqno;
                }
                return $item;
            })->toArray();
        }
        return parent::bulkCreate($parData);
    }

    public function update($parId, $parData)
    {
        return parent::update($parId, $parData);
    }

    public function getContractSheetsByContract($contractId)
    {
        return $this->data->where('contract_id', $contractId)->get();
    }
}
