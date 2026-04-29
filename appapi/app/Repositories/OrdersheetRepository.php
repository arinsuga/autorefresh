<?php

namespace App\Repositories;

use App\Repositories\Data\EloquentRepository;
use App\Repositories\Contracts\OrdersheetRepositoryInterface;

class OrdersheetRepository extends EloquentRepository implements OrdersheetRepositoryInterface
{
    protected $ordersheet;

    public function find($id)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])->find($id);
    }

    public function getOrdersheetsByOrder($orderId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('order_id', $orderId)->get();
    }

    public function getOrdersheetsByOrderWithRelations($orderId, array $relations = [])
    {
        $query = $this->data->where('order_id', $orderId);
        
        if (!empty($relations)) {
            $query->with($relations);
        }
        
        return $query->get();
    }

    public function getOrdersheetsByExpense($expenseId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('expenses_id', $expenseId)->get();
    }

    public function getOrdersheetsByProject($projectId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('project_id', $projectId)->get();
    }

    public function getOrdersheetsByContract($contractId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('contract_id', $contractId)->get();
    }

    public function getOrdersheetsByContractsheet($contractsheetId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('contractsheets_id', $contractsheetId)->get();
    }

    public function getOrdersheetsByVendor($vendorId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('vendor_id', $vendorId)->get();
    }

    public function getOrdersheetsBySheetgroup($sheetgroupId)
    {
        return $this->data->with(['project', 'contract', 'contractsheet', 'order', 'sheetgroup', 'vendortype', 'vendor'])
            ->where('sheetgroup_id', $sheetgroupId)->get();
    }
}
