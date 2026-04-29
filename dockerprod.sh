#!/bin/bash
run_ls() {

    clear
    echo "✅ Vierifying Containers..."
    docker ps -a

    echo ""

    echo "✅ Vierifying Images..."
    docker images

    echo ""
    echo "============================================================================================================================"
    echo ""

    echo "✅ Vierifying Compose Containers..."
    docker compose ps -a

    echo ""

    echo "✅ Vierifying Compose Images..."
    docker compose images

    echo ""
}

run_rm() {

    echo "✅ ====== Removing Containers ======"
    run_rmc
    echo "✅ ====== Removing Images ======"
    run_rmi

}

run_rma() {

    echo "✅ ====== Removing Containers ======"
    run_rmca
    echo "✅ ====== Removing Images ======"
    run_rmia
    echo "✅ ====== Removing Docker Compose ======"
    docker compose down --volumes --remove-orphans

}

run_rmc() {

    echo "✅ Removing Container authprod..."
    docker rm authprod --force ; \

    echo "✅ Removing Container authapi-authapi-service-1..."
    docker rm authapi-authapi-service-1 --force ; \

    echo "✅ Removing Container flexcozapi-authapi-service-1..."
    docker rm flexcozapi-authapi-service-1 --force ; \

    echo "✅ Vierifying Containers..."
    docker ps -a

}

run_rmca() {

    run_rmc

    echo "✅ Removing Container nginx..."
    docker rm nginx --force ; \

    echo "✅ Removing Container nginx-compose..."
    docker rm nginx-compose --force ; \

    echo "✅ Removing Container nginx-kubernetes..."
    docker rm nginx-kubernetes --force ; \

    echo "✅ Removing Container mysqldb..."
    docker rm mysqldb --force ; \

    echo "✅ Removing Container phpmyadmin..."
    docker rm phpmyadmin --force ; \

    echo "✅ Vierifying Containers..."
    docker ps -a
}

run_rmi() {

    echo "✅ Removing Image authprod..."
    docker rmi sugaprivate/authprod --force

}

run_rmia() {

    run_rmi

    echo "✅ Removing Image nginx-compose..."
    docker rmi sugaprivate/nginx-compose --force

    echo "✅ Removing Image nginx-kubernetes..."
    docker rmi sugaprivate/nginx-kubernetes --force

    echo "✅ Removing Image mariadb..."
    docker rmi sugaprivate/mariadb --force

    echo "✅ Removing Image phpmyadmin..."
    docker rmi sugaprivate/phpmyadmin --force

    echo "✅ Vierifying Images..."
    docker images

}

run_build() {

    clear
    echo "✅ Building Image authprod..."
    docker build -f docker-auth-prod -t sugaprivate/authprod:latest .

}

run_buildall() {

    run_build

    echo "✅ Building Image nginx-compose..."
    docker build -f docker-nginx-compose -t sugaprivate/nginx-compose:latest .

    echo "✅ Building Image nginx-kubernetes..."
    docker build -f docker-nginx-kubernetes -t sugaprivate/nginx-kubernetes:latest .

    echo "✅ Building Image mariadb..."
    docker build -f docker-mariadb -t sugaprivate/mariadb:latest .

    echo "✅ Building Image phpmyadmin..."
    docker build -f docker-phpmyadmin -t sugaprivate/phpmyadmin:latest .

    echo "✅ Vierifying..."
    docker images

}

run_push() {

    echo "✅ Push Image authprod to Container Register..."
    docker push sugaprivate/authprod

}

run_pushall() {

    run_push

    echo "✅ Push Image nginx-compose to Container Register..."
    docker push sugaprivate/nginx-compose

    echo "✅ Push Image nginx-kubernetes to Container Register..."
    docker push sugaprivate/nginx-kubernetes

    echo "✅ Push Image mariadb to Container Register..."
    docker push sugaprivate/mariadb

    echo "✅ Push Image phpmyadmin to Container Register..."
    docker push sugaprivate/phpmyadmin

}

run_buildpush() {

    echo "✅ Building Image..."
    run_build

    echo "✅ Push Image to Container Register..."
    run_push

    echo "✅ Vierifying Image..."
    docker images

}

run_buildpushall() {

    echo "✅ Building Image..."
    run_buildall

    echo "✅ Push Image to Container Register..."
    run_pushall

    echo "✅ Vierifying Image..."
    docker images

}

case "$1" in
  ls) run_ls ;;
  rm) run_rm ;;
  rma) run_rma ;;
  rmc) run_rmc ;;
  rmca) run_rmca ;;
  rmi) run_rmi ;;
  rmia) run_rmia ;;
  b) run_build ;;
  ba) run_buildall ;;
  p) run_push ;;
  pa) run_pushall ;;
  bp) run_buildpush ;;
  bpa) run_buildpushall ;;
  *)
    run_build
    exit 1
    ;;
esac