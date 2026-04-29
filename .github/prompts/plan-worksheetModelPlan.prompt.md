Plan: Create Worksheet model (namespace App) and add relations

Purpose:
- Add a clear Eloquent model for the `worksheets` table so application code can use relationships and mass assignment safely.

Steps (ordered):
1. Create model file `app/Worksheet.php` with `namespace App`.
   - Set `protected $table = 'worksheets'` explicitly.
   - Add `protected $dates = ['sheet_dt', 'sheet_payment_dt']`.
   - Add `$fillable` with the primary worksheet columns (see migration `2025_12_01_152346_create_worksheets_table.php`).

2. Add relations to existing models (use single-quoted class names):
   - `items()` : `hasMany('App\Worksheet', 'sheetheader_id')` — child worksheet items.
   - `header()` : `belongsTo('App\Worksheet', 'sheetheader_id')` — parent header.
   - `vendor()` : `belongsTo('App\Vendor', 'vendor_id')`.
   - `vendortype()` : `belongsTo('App\VendorType', 'vendortype_id')`.
   - `project()` : `belongsTo('App\Project', 'project_id')`.
   - `contract()` : `belongsTo('App\Contract', 'contract_id')`.
   - `sheetgroup()` : `belongsTo('App\SheetGroup', 'sheetgroup_id')`.
   - `contractSheet()` : `belongsTo('App\ContractSheet', 'contractsheet_id')`.
   - `os()` : `belongsTo('App\Os', 'os_id')`.

3. Keep model simple and consistent with `Attend` example:
   - Use `protected $dates` like `Attend` uses.
   - Relations should use `'App\ModelName'` string notation.

4. Verify model coverage:
   - Confirm all referenced models exist (`Vendor`, `VendorType`, `Project`, `Contract`, `SheetGroup`, `ContractSheet`, `Os`); if not, fallback to correct class name or create lightweight model stubs.

5. Add a minimal smoke test (or tinker snippet):
   - Example tinker commands to run inside appapi container:
     php artisan tinker
     >>> App\Worksheet::first();
     >>> App\Worksheet::with('items','vendor','sheetgroup')->first();

6. Commit and push:
   - `git add app/Worksheet.php database/seeds/SheetgroupsTableSeeder.php`
   - `git commit -m "Add Worksheet model and seeders for sheetgroups"`
   - `git push origin dev100`

Notes and decisions:
- Use `namespace App` to match your existing `User` and `Project` models.
- Do not add complicated accessors/mutators yet — keep API simple and extend later.
- If model class names differ (e.g., `Sheetgroup` vs `SheetGroup`), adapt relation class names before running tests.

Deliverables:
- `app/Worksheet.php` model file using `App` namespace.
- Tinker/test snippet to validate relations.
- Commit on `dev100` branch (optional - I can do it if you want).

Would you like me to create `app/Worksheet.php` now and run a quick tinker check inside the container?
