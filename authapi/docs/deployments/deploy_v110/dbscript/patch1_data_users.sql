-- ===================================================
-- UNUSED USERS ( table users )
-- ===================================================
delete FROM `users`
WHERE id > 3 and dept is null
