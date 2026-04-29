#!/bin/bash
php artisan key:generate
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
composer dump-autoload
if [ "$APP_ENV" = "local" ]; then
  php artisan serve --host=0.0.0.0 --port=9000
else
  # php artisan serve --host=0.0.0.0 --port=9000
  php-fpm -F
fi