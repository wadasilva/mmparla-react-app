#!/bin/bash

if ! [ -x "$(command -v docker-compose)" ]; then
    echo 'Error: docker-compose is not installed.' >&2
    exit 1
fi

domains=(wdasilva.ddns.net wdasilva-back.ddns.net)
rsa_key_size=4096
data_path="./data/certbot"
email="junior.js.02@gmail.com"
env=0 # 0-Dev 1-Staging 2-production - Set to 0 or 1 if you're testing your setup to avoid hitting request limits

if [ -d "$data_path" ]; then
    read -p "Existing data found for $domains. Continue and replace existing certificate ? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
        exit
    fi
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=$domains' \
    && chgrp -R nodecert $path/conf/live && chmod -R 755 $path/conf/live \
    && chgrp -R nodecert $path/conf/archive && chmod -R 755 $path/conf/archive" api
echo

docker-compose up --force-recreate -d api
docker-compose exec --user root -it api "/etc/init-create-nodecert-group.sh"

if [ $env == "1" ] || [ $env == "2" ]; then
    if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
        echo "### Downloading recommended TLS parameters ..."
        mkdir -p "$data_path"
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
        echo
    fi

    echo "### Starting nginx ..."
    docker-compose up --force-recreate -d web
    echo

    echo "### Deleting dummy certificate for $domains ..."
    docker-compose run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domains && \
    rm -Rf /etc/letsencrypt/archive/$domains && \
    rm -Rf /etc/letsencrypt/renewal/$domains.conf" web
    echo

    echo "### Requesting Let's Encrypt certificate for $domains ..."
    #Join $domains to -d args
    domain_args=""
    for domain in "${domains[@]}"; do
        domain_args="$domain_args -d $domain"
    done

    # Select appropriate email arg
    case "$email" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="--email $email" ;;
    esac

    # Enable staging mode if needed
    if [ $env == "1" ]; then staging_arg="--staging"; fi

    docker-compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
        $staging_arg \
        $email_arg \
        $domain_args \
        --rsa-key-size $rsa_key_size \
        --agree-tos \
        --force-renewal" web
    echo

    echo "### Reloading nginx ..."
    docker-compose exec web nginx -s reload
fi

echo "### Setup finished successfully!"
echo "### Run ""docker-compose up -d"" to start services."