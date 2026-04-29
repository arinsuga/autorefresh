# FlexCoz AppAPI - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Repository Pattern](#repository-pattern)
9. [Models & Relationships](#models--relationships)
10. [Development Setup](#development-setup)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [API Usage Examples](#api-usage-examples)

---

## Overview

**FlexCoz AppAPI** is a Laravel-based RESTful API service designed to manage construction projects, contracts, worksheets, vendors, and related entities. The application follows a repository pattern for data access and uses JWT authentication for secure API access.

### Key Features
- Project and contract management
- Worksheet and contract sheet tracking
- Vendor and vendor type management
- Unit of measure (UOM) management
- Reference type management
- Sheet group categorization
- JWT-based authentication
- RESTful API architecture
- Repository pattern for data abstraction

---

## System Architecture

### Architecture Pattern
The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         API Routes Layer            │
│    (routes/api.php, bo.php, etc)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Controller Layer              │
│   (app/Http/Controllers/*.php)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Repository Layer               │
│   (app/Repositories/*.php)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Model Layer                 │
│        (app/*.php)                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Database Layer              │
│      (MySQL/MariaDB)                │
└─────────────────────────────────────┘
```

### Design Patterns
1. **Repository Pattern**: Abstracts data access logic
2. **Dependency Injection**: Controllers receive repositories via constructor injection
3. **Service Provider Pattern**: Laravel's built-in service container
4. **RESTful API Design**: Standard HTTP methods and status codes

---

## Technology Stack

### Core Framework
- **Laravel Framework**: 5.8.*
- **PHP**: ^7.1.3

### Key Dependencies
- **tymon/jwt-auth**: ^1.0 - JWT authentication
- **intervention/image**: ^2.7 - Image processing
- **guzzlehttp/guzzle**: ^6.5 - HTTP client
- **fideloper/proxy**: ^4.0 - Trusted proxy handling

### Development Dependencies
- **phpunit/phpunit**: ^7.5 - Testing framework
- **fzaninotto/faker**: ^1.4 - Fake data generation
- **mockery/mockery**: ^1.0 - Mocking framework

### Database
- MySQL/MariaDB (configured via .env)

### Testing
- PHPUnit for unit and feature tests
- Custom bash scripts for test execution

---

## Project Structure

```
appapi/
├── app/
│   ├── Console/              # Artisan commands
│   ├── Exceptions/           # Exception handlers
│   ├── Http/
│   │   ├── Controllers/      # API controllers
│   │   │   ├── Absen/        # Attendance controllers
│   │   │   ├── Auth/         # Authentication controllers
│   │   │   ├── AuthController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── ContractController.php
│   │   │   ├── ContractSheetController.php
│   │   │   ├── WorksheetController.php
│   │   │   ├── VendorController.php
│   │   │   ├── VendorTypeController.php
│   │   │   ├── UomController.php
│   │   │   ├── RefftypeController.php
│   │   │   └── SheetGroupController.php
│   │   └── Middleware/       # HTTP middleware
│   ├── Providers/            # Service providers
│   ├── Repositories/         # Repository classes
│   │   ├── Contracts/        # Repository interfaces
│   │   ├── Data/             # Data repositories
│   │   ├── ProjectRepository.php
│   │   ├── ContractRepository.php
│   │   ├── ContractSheetRepository.php
│   │   ├── WorksheetRepository.php
│   │   ├── VendorRepository.php
│   │   ├── VendorTypeRepository.php
│   │   ├── UomRepository.php
│   │   ├── RefftypeRepository.php
│   │   └── SheetGroupRepository.php
│   ├── Project.php           # Project model
│   ├── Contract.php          # Contract model
│   ├── ContractSheet.php     # Contract sheet model
│   ├── Worksheet.php         # Worksheet model
│   ├── Vendor.php            # Vendor model
│   ├── VendorType.php        # Vendor type model
│   ├── Uom.php               # Unit of measure model
│   ├── Refftype.php          # Reference type model
│   ├── SheetGroup.php        # Sheet group model
│   ├── User.php              # User model
│   └── Role.php              # Role model
├── arins/                    # Custom namespace (Arins\\)
├── bootstrap/                # Application bootstrap
├── config/                   # Configuration files
├── database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Database migrations
│   └── seeds/                # Database seeders
├── docs/                     # Documentation
├── public/                   # Public assets
├── resources/                # Views, language files
├── routes/
│   ├── api.php               # Main API routes
│   ├── bo.php                # Back office routes
│   ├── fo.php                # Front office routes
│   ├── a0.php                # Admin routes
│   ├── main.php              # Main routes
│   ├── web.php               # Web routes
│   ├── channels.php          # Broadcast channels
│   └── console.php           # Console routes
├── storage/                  # Application storage
├── tests/
│   ├── Feature/              # Feature tests
│   ├── Unit/                 # Unit tests
│   └── bash/                 # Test execution scripts
├── vendor/                   # Composer dependencies
├── .env                      # Environment configuration
├── composer.json             # Composer dependencies
├── phpunit.xml               # PHPUnit configuration
└── artisan                   # Artisan CLI
```

---

## Database Schema

### Core Tables

#### 1. **projects**
Stores project information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| project_name | varchar | No | Project name |
| project_description | varchar | Yes | Project description |
| project_owner | varchar | Yes | Project owner |
| project_pic | varchar | Yes | Person in charge |
| project_number | varchar | Yes | Unique project number |
| project_startdt | date | Yes | Project start date |
| project_enddt | date | Yes | Project end date |
| project_address | varchar | Yes | Project address |
| project_latitude | varchar | Yes | GPS latitude |
| project_longitude | varchar | Yes | GPS longitude |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Has many `worksheets`

---

#### 2. **contracts**
Stores contract information linked to projects.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| project_id | bigint (FK) | No | Foreign key to projects |
| contract_number | varchar | No | Unique contract number |
| contract_name | varchar | No | Contract name |
| contract_description | text | Yes | Contract description |
| contract_amount | decimal(15,2) | Yes | Contract amount |
| contract_startdt | date | Yes | Contract start date |
| contract_enddt | date | Yes | Contract end date |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Belongs to `project`
- Has many `contract_sheets`

---

#### 3. **contractsheets**
Stores contract sheet details.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| contract_id | bigint (FK) | No | Foreign key to contracts |
| sheet_group_id | bigint (FK) | Yes | Foreign key to sheet_groups |
| sheet_code | varchar | Yes | Sheet code |
| sheet_name | varchar | No | Sheet name |
| sheet_description | text | Yes | Sheet description |
| sheet_qty | decimal(15,2) | Yes | Sheet quantity |
| sheet_uom_id | bigint (FK) | Yes | Foreign key to uoms |
| sheet_unit_price | decimal(15,2) | Yes | Unit price |
| sheet_total_price | decimal(15,2) | Yes | Total price |
| sheet_notes | text | Yes | Additional notes |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Belongs to `contract`
- Belongs to `sheet_group`
- Belongs to `uom`

---

#### 4. **worksheets**
Stores worksheet information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| project_id | bigint (FK) | No | Foreign key to projects |
| sheet_group_id | bigint (FK) | Yes | Foreign key to sheet_groups |
| vendor_id | bigint (FK) | Yes | Foreign key to vendors |
| sheet_code | varchar | Yes | Sheet code |
| sheet_name | varchar | No | Sheet name |
| sheet_description | text | Yes | Sheet description |
| sheet_qty | decimal(15,2) | Yes | Sheet quantity |
| sheet_uom_id | bigint (FK) | Yes | Foreign key to uoms |
| sheet_unit_price | decimal(15,2) | Yes | Unit price |
| sheet_total_price | decimal(15,2) | Yes | Total price |
| sheet_notes | text | Yes | Additional notes |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Belongs to `project`
- Belongs to `sheet_group`
- Belongs to `vendor`
- Belongs to `uom`

---

#### 5. **vendors**
Stores vendor/supplier information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| vendor_type_id | bigint (FK) | Yes | Foreign key to vendor_types |
| vendor_code | varchar | Yes | Vendor code |
| vendor_name | varchar | No | Vendor name |
| vendor_description | text | Yes | Vendor description |
| vendor_address | text | Yes | Vendor address |
| vendor_phone | varchar | Yes | Phone number |
| vendor_email | varchar | Yes | Email address |
| vendor_contact_person | varchar | Yes | Contact person |
| vendor_contact_phone | varchar | Yes | Contact phone |
| vendor_contact_email | varchar | Yes | Contact email |
| vendor_npwp | varchar | Yes | Tax ID (NPWP) |
| vendor_bank_name | varchar | Yes | Bank name |
| vendor_bank_account | varchar | Yes | Bank account number |
| vendor_bank_account_name | varchar | Yes | Account holder name |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Belongs to `vendor_type`
- Has many `worksheets`

---

#### 6. **vendortypes**
Stores vendor type categories.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| vendor_type_code | varchar | Yes | Type code |
| vendor_type_name | varchar | No | Type name |
| vendor_type_description | text | Yes | Type description |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Has many `vendors`

---

#### 7. **uoms** (Units of Measure)
Stores unit of measure definitions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| uom_code | varchar | Yes | UOM code |
| uom_name | varchar | No | UOM name |
| uom_description | text | Yes | UOM description |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Used by `contract_sheets` and `worksheets`

---

#### 8. **refftypes** (Reference Types)
Stores reference type definitions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| refftype_code | varchar | Yes | Reference type code |
| refftype_name | varchar | No | Reference type name |
| refftype_description | text | Yes | Reference type description |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

---

#### 9. **sheetgroups**
Stores sheet group categories.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| sheet_group_code | varchar | Yes | Group code |
| sheet_group_name | varchar | No | Group name |
| sheet_group_description | text | Yes | Group description |
| sheet_group_type | varchar | Yes | Group type |
| is_active | boolean | No | Active status (default: 1) |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Has many `contract_sheets`
- Has many `worksheets`

---

#### 10. **users**
Stores user authentication and profile information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| name | varchar | No | User full name |
| email | varchar | No | Email (unique) |
| password | varchar | No | Hashed password |
| remember_token | varchar | Yes | Remember token |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Has many `roles` (many-to-many)

---

#### 11. **roles**
Stores user role definitions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint (PK) | No | Primary key |
| role_name | varchar | No | Role name |
| role_description | text | Yes | Role description |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

**Relationships:**
- Has many `users` (many-to-many)

---

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│  projects   │1──────*│  contracts   │1──────*│ contractsheets  │
└─────────────┘         └──────────────┘         └─────────────────┘
      │1                                                  │
      │                                                   │
      │                                                   │*
      │*                                          ┌──────▼──────┐
┌─────▼──────┐                                   │ sheetgroups │
│ worksheets │*──────────────────────────────────┤             │
└────────────┘                                   └─────────────┘
      │*                    │*
      │                     │
      │*                    │*
┌─────▼──────┐         ┌───▼────┐
│  vendors   │         │  uoms  │
└────────────┘         └────────┘
      │*
      │
      │1
┌─────▼──────────┐
│ vendortypes    │
└────────────────┘

┌─────────┐         ┌──────────┐
│  users  │*──────*│  roles   │
└─────────┘         └──────────┘
```

---

## API Endpoints

### Base URL
```
http://your-domain.com/
```

**Note:** The API routes do NOT use the `/api` prefix. Routes are served directly from the root.

---

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Successfully logged out"
}
```

---

#### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### Project Endpoints

#### List All Projects
```http
GET /projects
Authorization: Bearer {token}
Accept: application/json
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "project_number": "PRJ-001",
      "project_name": "Construction Project A",
      "project_description": "Description here",
      "is_active": true,
      "created_at": "2025-12-01T00:00:00.000000Z",
      "updated_at": "2025-12-01T00:00:00.000000Z"
    }
  ]
}
```

---

#### Get Single Project
```http
GET /projects/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": 1,
    "project_number": "PRJ-001",
    "project_name": "Construction Project A",
    "is_active": true
  }
}
```

---

#### Create Project
```http
POST /projects
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "project_number": "PRJ-002",
  "project_name": "New Construction Project",
  "project_description": "Project description",
  "is_active": true
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": 2,
    "project_number": "PRJ-002",
    "project_name": "New Construction Project",
    "is_active": true
  }
}
```

---

#### Update Project
```http
PUT /projects/{id}
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "project_name": "Updated Project Name",
  "is_active": false
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": 1,
    "project_number": "PRJ-001",
    "project_name": "Updated Project Name",
    "is_active": false
  }
}
```

---

#### Delete Project
```http
DELETE /projects/{id}
Authorization: Bearer {token}
Accept: application/json
```

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

---

### Contract Endpoints

#### List All Contracts
```http
GET /contracts
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Single Contract
```http
GET /contracts/{id}
Authorization: Bearer {token}
Accept: application/json
```

---

#### Create Contract
```http
POST /contracts
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "project_id": 1,
  "contract_number": "CNT-001",
  "contract_name": "Main Contract",
  "contract_amount": 1000000.00,
  "contract_startdt": "2025-01-01",
  "contract_enddt": "2025-12-31",
  "is_active": true
}
```

---

#### Update Contract
```http
PUT /contracts/{id}
Authorization: Bearer {token}
Accept: application/json
```

---

#### Delete Contract
```http
DELETE /contracts/{id}
Authorization: Bearer {token}
Accept: application/json
```

---

### Contract Sheet Endpoints

#### List All Contract Sheets
```http
GET /contractsheets
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Contract Sheets by Contract
```http
GET /contracts/{contractId}/sheets
Authorization: Bearer {token}
Accept: application/json
```

---

#### Create Contract Sheet
```http
POST /contractsheets
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:**
```json
{
  "contract_id": 1,
  "sheet_group_id": 1,
  "sheet_name": "Foundation Work",
  "sheet_qty": 100.00,
  "sheet_uom_id": 1,
  "sheet_unit_price": 5000.00,
  "sheet_total_price": 500000.00,
  "is_active": true
}
```

---

### Worksheet Endpoints

#### List All Worksheets
```http
GET /worksheets
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Worksheets by Project
```http
GET /projects/{projectId}/worksheets
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Worksheets by Sheet Group
```http
GET /sheetgroups/{sheetGroupId}/worksheets
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Worksheets by Vendor
```http
GET /vendors/{vendorId}/worksheets
Authorization: Bearer {token}
Accept: application/json
```

---

#### Create Worksheet
```http
POST /worksheets
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:**
```json
{
  "project_id": 1,
  "sheet_group_id": 1,
  "vendor_id": 1,
  "sheet_name": "Concrete Work",
  "sheet_qty": 50.00,
  "sheet_uom_id": 2,
  "sheet_unit_price": 3000.00,
  "sheet_total_price": 150000.00,
  "is_active": true
}
```

---

### Vendor Endpoints

#### List All Vendors
```http
GET /vendors
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Vendors by Type
```http
GET /vendortypes/{vendorTypeId}/vendors
Authorization: Bearer {token}
Accept: application/json
```

---

#### Create Vendor
```http
POST /vendors
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:**
```json
{
  "vendor_type_id": 1,
  "vendor_name": "ABC Construction Supply",
  "vendor_email": "contact@abc.com",
  "vendor_phone": "+62123456789",
  "is_active": true
}
```

---

### Vendor Type Endpoints

#### List All Vendor Types
```http
GET /vendortypes
Authorization: Bearer {token}
Accept: application/json
```

---

#### Create Vendor Type
```http
POST /vendortypes
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:**
```json
{
  "vendor_type_name": "Material Supplier",
  "vendor_type_description": "Suppliers of construction materials",
  "is_active": true
}
```

---

### UOM (Unit of Measure) Endpoints

#### List All UOMs
```http
GET /uoms
Authorization: Bearer {token}
Accept: application/json
```

---

#### Create UOM
```http
POST /uoms
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:**
```json
{
  "uom_name": "Cubic Meter",
  "uom_code": "M3",
  "is_active": true
}
```

---

### Reference Type Endpoints

#### List All Reference Types
```http
GET /refftypes
Authorization: Bearer {token}
Accept: application/json
```

---

### Sheet Group Endpoints

#### List All Sheet Groups
```http
GET /sheetgroups
Authorization: Bearer {token}
Accept: application/json
```

---

#### Get Sheet Groups by Type
```http
GET /sheetgroups/type/{type}
Authorization: Bearer {token}
Accept: application/json
```

---

## Authentication & Authorization

### JWT Authentication

The API uses **JWT (JSON Web Tokens)** for authentication via the `tymon/jwt-auth` package.

#### Authentication Flow

1. **Register/Login**: User receives a JWT token
2. **Include Token**: Send token in `Authorization` header for protected routes
3. **Token Expiration**: Tokens expire after configured time (default: 60 minutes)
4. **Refresh Token**: Use `/auth/refresh` to get a new token before expiration

#### Middleware

Protected routes use the `authjwt` middleware, which:
- Validates JWT token
- Checks token expiration
- Authenticates the user
- Returns 401 Unauthorized if token is invalid

#### Headers Required

```http
Authorization: Bearer {your-jwt-token}
Accept: application/json
```

---

## Repository Pattern

### Overview

The application implements the **Repository Pattern** to abstract data access logic from business logic.

### Structure

```
app/Repositories/
├── Contracts/                    # Repository interfaces
│   ├── ProjectRepositoryInterface.php
│   ├── ContractRepositoryInterface.php
│   └── ...
├── ProjectRepository.php         # Concrete implementations
├── ContractRepository.php
└── ...
```

### Benefits

1. **Separation of Concerns**: Controllers don't directly interact with models
2. **Testability**: Easy to mock repositories in tests
3. **Flexibility**: Can swap implementations without changing controllers
4. **Reusability**: Common queries centralized in repositories

### Example Repository

```php
<?php

namespace App\Repositories;

use App\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;

class ProjectRepository implements ProjectRepositoryInterface
{
    protected $model;

    public function __construct(Project $model)
    {
        $this->model = $model;
    }

    public function getProjectsByActive()
    {
        return $this->model->where('is_active', 1)->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $project = $this->find($id);
        $project->update($data);
        return $project;
    }

    public function delete($id)
    {
        return $this->model->destroy($id);
    }
}
```

### Dependency Injection

Repositories are injected into controllers via constructor:

```php
class ProjectController extends Controller
{
    protected $repository;

    public function __construct(ProjectRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }
}
```

---

## Models & Relationships

### Project Model

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';
    
    protected $fillable = [
        'project_number',
        'project_name',
        'project_description',
        'is_active',
    ];
    
    protected $dates = [
        'created_at',
        'updated_at',
    ];
    
    // Relationships
    public function worksheets()
    {
        return $this->hasMany('App\Worksheet', 'project_id');
    }
    
    public function contracts()
    {
        return $this->hasMany('App\Contract', 'project_id');
    }
}
```

---

### Contract Model

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $table = 'contracts';
    
    protected $fillable = [
        'project_id',
        'contract_number',
        'contract_name',
        'contract_description',
        'contract_amount',
        'is_active',
    ];
    
    // Relationships
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }
    
    public function contractSheets()
    {
        return $this->hasMany('App\ContractSheet', 'contract_id');
    }
}
```

---

### Vendor Model

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $table = 'vendors';
    
    protected $fillable = [
        'vendor_type_id',
        'vendor_name',
        'vendor_email',
        'vendor_phone',
        'is_active',
    ];
    
    // Relationships
    public function vendorType()
    {
        return $this->belongsTo('App\VendorType', 'vendor_type_id');
    }
    
    public function worksheets()
    {
        return $this->hasMany('App\Worksheet', 'vendor_id');
    }
}
```

---

## Development Setup

### Prerequisites

- PHP >= 7.1.3
- Composer
- MySQL/MariaDB
- Node.js & NPM (for asset compilation)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flexcozapi/appapi
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

5. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Generate application key**
   ```bash
   php artisan key:generate
   ```

7. **Generate JWT secret**
   ```bash
   php artisan jwt:secret
   ```

8. **Run migrations**
   ```bash
   php artisan migrate
   ```

9. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

10. **Start development server**
    ```bash
    php artisan serve
    ```

The API will be available at `http://localhost:8000`

---

### Docker Setup

If using Docker (check for `docker-compose.yml`):

```bash
docker-compose up -d
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
```

---

## Testing

### Running Tests

#### Run all tests
```bash
vendor/bin/phpunit
```

#### Run specific test file
```bash
vendor/bin/phpunit tests/Feature/ProjectControllerTest.php
```

#### Run specific test method
```bash
vendor/bin/phpunit --filter it_returns_a_single_project tests/Feature/ProjectControllerTest.php
```

### Custom Test Scripts

The project includes bash scripts for running tests:

```bash
# Located in tests/bash/
./tests/bash/run_vendor_test.sh
```

### Test Structure

```
tests/
├── Feature/                      # Feature/Integration tests
│   ├── ProjectControllerTest.php
│   ├── ContractControllerTest.php
│   ├── ContractSheetControllerTest.php
│   ├── VendorControllerTest.php
│   └── ...
├── Unit/                         # Unit tests
└── bash/                         # Test execution scripts
```

### Writing Tests

Example test structure:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\User;
use App\Project;

class ProjectControllerTest extends TestCase
{
    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test user and get JWT token
        $this->user = factory(User::class)->create();
        $this->token = auth()->login($this->user);
    }

    public function test_it_returns_all_projects()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ])->get('/projects');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }
}
```

---

## Deployment

### Production Checklist

1. **Environment Configuration**
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Configure production database credentials
   - Set secure `APP_KEY`

2. **Optimize Application**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Database Migration**
   ```bash
   php artisan migrate --force
   ```

4. **Set Permissions**
   ```bash
   chmod -R 775 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

5. **Web Server Configuration**
   - Point document root to `public/` directory
   - Configure URL rewriting for Laravel

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/appapi/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## API Usage Examples

### Complete Workflow Example

#### 1. Register and Login

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Response: Save the access_token
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### 2. Create a Project

```bash
curl -X POST http://localhost:8000/projects \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "project_number": "PRJ-2025-001",
    "project_name": "Shopping Mall Construction",
    "project_description": "5-story shopping mall",
    "is_active": true
  }'
```

#### 3. Create a Contract for the Project

```bash
curl -X POST http://localhost:8000/contracts \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "contract_number": "CNT-2025-001",
    "contract_name": "Main Construction Contract",
    "contract_amount": 5000000000,
    "contract_startdt": "2025-01-01",
    "contract_enddt": "2025-12-31",
    "is_active": true
  }'
```

#### 4. Create Contract Sheets

```bash
curl -X POST http://localhost:8000/contractsheets \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "contract_id": 1,
    "sheet_group_id": 1,
    "sheet_name": "Foundation Work",
    "sheet_qty": 1000,
    "sheet_uom_id": 1,
    "sheet_unit_price": 500000,
    "sheet_total_price": 500000000,
    "is_active": true
  }'
```

#### 5. Get Contract Sheets by Contract

```bash
curl -X GET http://localhost:8000/contracts/1/sheets \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Accept: application/json"
```

---

## Error Handling

### Standard Error Responses

#### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

#### 404 Not Found
```json
{
  "error": "Project not found"
}
```

#### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "project_number": [
      "The project number has already been taken."
    ]
  }
}
```

#### 500 Internal Server Error
```json
{
  "message": "Server Error"
}
```

---

## Maintenance & Support

### Database Refresh (Development)

```bash
# Reset database and reseed
php artisan migrate:fresh --seed
```

Or use the custom script:
```bash
./devrefresh.sh
```

### Clearing Caches

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Logs

Application logs are stored in:
```
storage/logs/laravel.log
```

---

## Additional Resources

### Postman Collection

A Postman collection is available at:
```
appapi.postman_collection.json
```

Import this into Postman for easy API testing.

### Environment Variables

Configure these in your Postman environment:
- `base_url`: `http://localhost:8000`
- `token`: `{{access_token}}` (auto-populated after login)

---

## Version History

- **v1.0.0** (2025-12-01): Initial release
  - Project management
  - Contract management
  - Worksheet management
  - Vendor management
  - JWT authentication

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact & Support

For questions or support, please contact the development team.

---

**Last Updated**: December 5, 2025
