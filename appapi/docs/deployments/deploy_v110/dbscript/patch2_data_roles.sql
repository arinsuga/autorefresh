-- ===================================================
-- SYSTEM ( table roles )
-- ===================================================
INSERT INTO `roles` (`id`, `app_id`, `code`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 4, 'att-sa', 'Super Admin Attendance Tracking', 'Full Kontrol Attendance Tracking', NULL, NULL),
(2, 4, 'att-adm', 'Admin Attendance Tracking', 'Admin Attendance Tracking', NULL, NULL),
(3, 4, 'att-usr', 'User Attendance Tracking', 'User Attendance Tracking', NULL, NULL);

-- ===================================================
-- DNB ( table roles )
-- ===================================================
-- SA_ROLE_CODE
update roles set
code = 'att-sa',
name = 'Super Admin Attendance Tracking (DNB)',
description = 'Full Kontrol Attendance Tracking (DNB)'
where id = 10;

-- ADM_ROLE_CODE
update roles set
code = 'att-adm',
name = 'Admin Attendance Tracking (DNB)',
description = 'Admin Attendance Tracking (DNB)'
where id = 11;

-- ===================================================
-- HR ( table roles )
-- ===================================================
-- SA_ROLE_CODE
update roles set
code = 'att-sa',
name = 'Super Admin Attendance Tracking (HR)',
description = 'Full Kontrol Attendance Tracking (HR)'
where id = 15;

-- ADM_ROLE_CODE
update roles set
code = 'att-adm',
name = 'Admin Attendance Tracking (HR)',
description = 'Admin Attendance Tracking (HR)'
where id = 16;
