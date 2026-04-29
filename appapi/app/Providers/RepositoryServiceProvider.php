<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Repository Contracts
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Contracts\ContractRepositoryInterface;
use App\Repositories\Contracts\SheetGroupRepositoryInterface;
use App\Repositories\Contracts\VendorRepositoryInterface;
use App\Repositories\Contracts\VendorTypeRepositoryInterface;
use App\Repositories\Contracts\RefftypeRepositoryInterface;
use App\Repositories\Contracts\ContractSheetRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\OrdersheetRepositoryInterface;
use App\Repositories\Contracts\OrderStatusRepositoryInterface;
use App\Repositories\Contracts\ContractStatusRepositoryInterface;
use App\Repositories\Contracts\ProjectStatusRepositoryInterface;
use App\Repositories\Contracts\UomNormalizationRepositoryInterface;
use App\Repositories\Contracts\ContractOrderSummaryRepositoryInterface;
use App\Repositories\Contracts\ExpenseRepositoryInterface;
use App\Repositories\Contracts\ExpenseStatusRepositoryInterface;
// AutoRefresh Repository Contracts
use App\Repositories\Contracts\BranchRepositoryInterface;
use App\Repositories\Contracts\VehicleTypeRepositoryInterface;
use App\Repositories\Contracts\ServiceTypeRepositoryInterface;
use App\Repositories\Contracts\PaymentMethodRepositoryInterface;
use App\Repositories\Contracts\TransactionRepositoryInterface;

// Repository Implementations
use App\Repositories\ProjectRepository;
use App\Repositories\ContractRepository;
use App\Repositories\SheetGroupRepository;
use App\Repositories\VendorRepository;
use App\Repositories\VendorTypeRepository;
use App\Repositories\RefftypeRepository;
use App\Repositories\ContractSheetRepository;
use App\Repositories\OrderRepository;
use App\Repositories\OrdersheetRepository;
use App\Repositories\Eloquents\OrderStatusRepository;
use App\Repositories\ContractStatusRepository;
use App\Repositories\ProjectStatusRepository;
use App\Repositories\UomNormalizationRepository;
use App\Repositories\ContractOrderSummaryRepository;
use App\Repositories\ExpenseRepository;
use App\Repositories\ExpenseStatusRepository;
// AutoRefresh Repository Implementations
use App\Repositories\BranchRepository;
use App\Repositories\VehicleTypeRepository;
use App\Repositories\ServiceTypeRepository;
use App\Repositories\PaymentMethodRepository;
use App\Repositories\TransactionRepository;

// Models
use App\Project;
use App\Contract;
use App\SheetGroup;
use App\Vendor;
use App\VendorType;
use App\Refftype;
use App\ContractSheet;
use App\Order;
use App\Ordersheet;
use App\OrderStatus;
use App\ContractStatus;
use App\ProjectStatus;
use App\UomNormalization;
use App\App; // Import App facade if needed for bindings, but App\Order etc is used directly below.
use App\ContractOrderSummary;
use App\Expense;
use App\ExpenseStatus;
// AutoRefresh Models
use App\Branch;
use App\VehicleType;
use App\ServiceType;
use App\PaymentMethod;
use App\Transaction;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Project Repository Binding
        $this->app->bind(ProjectRepositoryInterface::class, function ($app) {
            return new ProjectRepository(new Project());
        });

        // Contract Repository Binding
        $this->app->bind(ContractRepositoryInterface::class, function ($app) {
            return new ContractRepository(new Contract());
        });

        // SheetGroup Repository Binding
        $this->app->bind(SheetGroupRepositoryInterface::class, function ($app) {
            return new SheetGroupRepository(new SheetGroup());
        });

        // Vendor Repository Binding
        $this->app->bind(VendorRepositoryInterface::class, function ($app) {
            return new VendorRepository(new Vendor());
        });

        // VendorType Repository Binding
        $this->app->bind(VendorTypeRepositoryInterface::class, function ($app) {
            return new VendorTypeRepository(new VendorType());
        });

        // Refftype Repository Binding
        $this->app->bind(RefftypeRepositoryInterface::class, function ($app) {
            return new RefftypeRepository(new Refftype());
        });

        // ContractSheet Repository Binding
        $this->app->bind(ContractSheetRepositoryInterface::class, function ($app) {
            return new ContractSheetRepository(new ContractSheet());
        });

        // Order Repository Binding
        $this->app->bind(OrderRepositoryInterface::class, function ($app) {
            return new OrderRepository(new Order());
        });

        // Ordersheet Repository Binding
        $this->app->bind(OrdersheetRepositoryInterface::class, function ($app) {
            return new OrdersheetRepository(new Ordersheet());
        });

        // OrderStatus Repository Binding
        $this->app->bind(OrderStatusRepositoryInterface::class, function ($app) {
            return new OrderStatusRepository(new OrderStatus());
        });
        // ContractStatus Repository Binding
        $this->app->bind(ContractStatusRepositoryInterface::class, function ($app) {
            return new ContractStatusRepository(new ContractStatus());
        });

        // ProjectStatus Repository Binding
        $this->app->bind(ProjectStatusRepositoryInterface::class, function ($app) {
            return new ProjectStatusRepository(new ProjectStatus());
        });

        // UomNormalization Repository Binding
        $this->app->bind(UomNormalizationRepositoryInterface::class, function ($app) {
            return new UomNormalizationRepository(new UomNormalization());
        });

        // ContractOrderSummary Repository Binding
        $this->app->bind(ContractOrderSummaryRepositoryInterface::class, function ($app) {
            return new ContractOrderSummaryRepository(new ContractOrderSummary());
        });

        // Expense Repository Binding
        $this->app->bind(ExpenseRepositoryInterface::class, function ($app) {
            return new ExpenseRepository(new Expense(), $app->make(OrderRepositoryInterface::class));
        });

        // ExpenseStatus Repository Binding
        $this->app->bind(ExpenseStatusRepositoryInterface::class, function ($app) {
            return new ExpenseStatusRepository(new ExpenseStatus());
        });

        // AutoRefresh Bindings
        // Branch Repository Binding
        $this->app->bind(BranchRepositoryInterface::class, function ($app) {
            return new BranchRepository(new Branch());
        });

        // VehicleType Repository Binding
        $this->app->bind(VehicleTypeRepositoryInterface::class, function ($app) {
            return new VehicleTypeRepository(new VehicleType());
        });

        // ServiceType Repository Binding
        $this->app->bind(ServiceTypeRepositoryInterface::class, function ($app) {
            return new ServiceTypeRepository(new ServiceType());
        });

        // PaymentMethod Repository Binding
        $this->app->bind(PaymentMethodRepositoryInterface::class, function ($app) {
            return new PaymentMethodRepository(new PaymentMethod());
        });

        // Transaction Repository Binding
        $this->app->bind(TransactionRepositoryInterface::class, function ($app) {
            return new TransactionRepository(new Transaction());
        });
    }

    public function boot()
    {
        //
    }
}
