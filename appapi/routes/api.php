<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication
// Route::post('auth/register', 'AuthController@register')->name('auth.register');
// Route::post('auth/login', 'AuthController@login')->name('auth.login');
// Route::post('auth/logout', 'AuthController@logout')->name('auth.logout');
// Route::post('auth/refresh', 'AuthController@refresh')->name('auth.refresh');
// Route::delete('auth/blacklist', 'AuthController@blacklist')->name('auth.blacklist');
// Route::get('auth/me', 'AuthController@me')->name('auth.me');
// Route::get('auth/status', 'AuthController@status')->name('auth.status');


// // Contracts API
// Route::apiResource('contracts', 'ContractController');
// // Orders API
// Route::apiResource('orders', 'OrderController');
// Route::get('orders/project/{projectId}', 'OrderController@getByProject')->name('orders.by.project');
// Route::get('orders/contract/{contractId}', 'OrderController@getByContract')->name('orders.by.contract');
// // Order Statuses API
// Route::apiResource('orderstatuses', 'OrderStatusController')->only(['index', 'show']);
// // Contract Statuses API
// Route::apiResource('contractstatuses', 'ContractStatusController')->only(['index', 'show']);
// // Project Statuses API
// Route::apiResource('projectstatuses', 'ProjectStatusController')->only(['index', 'show']);
// // Contract Sheets API
// Route::apiResource('contractsheets', 'ContractSheetController');
// Route::get('contractsheets/summary/project/{projectId}/contract/{contractId}', 'ContractSheetController@getOrderSummaryByProjectAndContract')->name('contractsheets.summary.by.project.and.contract');
// Route::get('contractsheets/summary/{contractId}/exclude-order/{orderId}', 'ContractSheetController@getOrderSummaryByContractExcludingOrder')->name('contractsheets.summary.exclude-order');
// Route::get('contractsheets/summary/{contractId}', 'ContractSheetController@getOrderSummaryByContract')->name('contractsheets.summary.by.contract');
// Route::get('contractsheets/summary/{contractId}/{contractsheetId}', 'ContractSheetController@getOrderSummaryByContractAndSheet')->name('contractsheets.summary.by.contract.and.sheet');
// Route::get('contracts/{contractId}/sheets', 'ContractSheetController@getByContract')->name('contractsheets.by.contract');
// // Ordersheets API
// Route::apiResource('ordersheets', 'OrdersheetController');
// Route::get('ordersheets/order/{orderId}', 'OrdersheetController@getByOrder')->name('ordersheets.by.order');
// Route::get('ordersheets/order/{orderId}/optimized', 'OrdersheetController@getByOrderOptimized')->name('ordersheets.by.order.optimized');
// Route::get('ordersheets/expense/{expenseId}', 'OrdersheetController@getByExpense')->name('ordersheets.by.expense');
// Route::get('ordersheets/project/{projectId}', 'OrdersheetController@getByProject')->name('ordersheets.by.project');
// Route::get('ordersheets/contract/{contractId}', 'OrdersheetController@getByContract')->name('ordersheets.by.contract');
// // Expenses API
// Route::apiResource('expenses', 'ExpenseController');
// Route::get('expenses/project/{projectId}', 'ExpenseController@getByProject')->name('expenses.by.project');
// Route::get('expenses/contract/{contractId}', 'ExpenseController@getByContract')->name('expenses.by.contract');
// // Sheet Groups API
// Route::apiResource('sheetgroups', 'SheetGroupController');
// Route::get('sheetgroups/type/{type}', 'SheetGroupController@getByType')->name('sheetgroups.by.type');
// // Vendors API
// Route::apiResource('vendors', 'VendorController');
// Route::get('vendortypes/{vendorTypeId}/vendors', 'VendorController@getByType')->name('vendors.by.type');
// // Vendor Types API
// Route::apiResource('vendortypes', 'VendorTypeController');
// // UOM Normalizations API
// Route::apiResource('uom-normalizations', 'UomNormalizationController');
// // Reference Types API
// Route::apiResource('refftypes', 'RefftypeController');
// // Reports API
// Route::get('reports/order-recap', 'ReportController@orderRecap');


// Projects API
Route::apiResource('projects', 'ProjectController');
// AutoRefresh Routes
Route::group(['middleware' => 'authjwt'], function () {
    // Branches
    Route::get('branches/active', 'BranchController@getActive');
    Route::resource('branches', 'BranchController');

    // Vehicle Types
    Route::get('vehicle-types/active', 'VehicleTypeController@getActive');
    Route::resource('vehicle-types', 'VehicleTypeController');

    // Service Types
    Route::get('service-types/active', 'ServiceTypeController@getActive');
    Route::get('service-types/vehicle-type/{vehicleTypeId}', 'ServiceTypeController@getByVehicleType');
    Route::resource('service-types', 'ServiceTypeController');

    // Payment Methods
    Route::get('payment-methods/active', 'PaymentMethodController@index');
    Route::resource('payment-methods', 'PaymentMethodController');

    // Transactions
    Route::get('transactions/branch/{branchId}', 'TransactionController@getByBranch');
    Route::get('transactions/report/detail', 'TransactionController@getReportDetail');
    Route::get('transactions/report/summary', 'TransactionController@getReportSummary');
    Route::get('transactions/plate-lookup', 'TransactionController@findByPlateNumber');
    Route::resource('transactions', 'TransactionController');
});
