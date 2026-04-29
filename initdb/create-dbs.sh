#!/bin/bash
set -e

echo "Creating databases and users..."

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
    -- Create two application databases
    CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE_APPAPI} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    -- Create users with passwords from environment variables
    CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
    CREATE USER IF NOT EXISTS '${MYSQL_USER_APPAPI}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD_APPAPI}';

    -- Grant privileges to your app users
    GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';
    GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE_APPAPI}.* TO '${MYSQL_USER_APPAPI}'@'%';

    -- Apply changes
    FLUSH PRIVILEGES;
EOSQL

echo "Databases and users created successfully!"
