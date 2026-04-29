sed -i 's/\r$//' dockerdev.sh
sed -i 's/\r$//' dockerprod.sh
sed -i 's/\r$//' entrypoint.sh
sed -i 's/\r$//' wait-for-it.sh
sed -i 's/\r$//' nginx/nginx-compose.conf
sed -i 's/\r$//' nginx/nginx-kubernetes.conf

sed -i 's/\r$//' k8s/app-config.yml
sed -i 's/\r$//' k8s/app-deployment.yml
sed -i 's/\r$//' k8s/app-ingress.yml
sed -i 's/\r$//' k8s/app-secret.yml
sed -i 's/\r$//' k8s/db-statefulset.yml
sed -i 's/\r$//' k8s/nginx-deployment.yml
sed -i 's/\r$//' k8s/phpmyadmin-deployment.yml
sed -i 's/\r$//' kubectl-remove.sh
sed -i 's/\r$//' startdev.sh
sed -i 's/\r$//' wsladdhosts.sh
