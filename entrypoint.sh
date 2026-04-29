#!/bin/bash

# Fail fast if DB_PORT is not set
: "${DB_PORT:?DB_PORT is not set}"

php artisan key:generate
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
composer dump-autoload
/usr/local/bin/wait-for-it.sh "db:$DB_PORT" --timeout=30 --strict -- echo "DB is up"
php artisan migrate
php artisan db:seed
if [ "$APP_ENV" = "local" ]; then
  php artisan serv --host=0.0.0.0 --port=9000
else
  php-fpm -F
fi

