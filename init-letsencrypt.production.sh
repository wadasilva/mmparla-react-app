#!/bin/bash

if ! [ -x "$(command -v docker-compose)" ]; then
    echo 'Error: docker-compose is not installed.' >&2
    exit 1
fi

domains=(montajedemueblesparla.es www.montajedemueblesparla.es api.montajedemueblesparla.es)
rsa_key_size=4096
data_path="/etc/data/certbot"
webroot="/var/www/certbot"
email="junior.js.02@gmail.com"
env=2 # 0-Dev 1-Staging 2-production - Set to 0 or 1 if you're testing your setup to avoid hitting request limits
remote="~/.ssh/id_rsa root@montajedemueblesparla.es"
exists=$(ssh -i $remote [ -d "$data_path" ] && echo 1)

if [ $exists == 1 ]; then
    read -p "Existing data found for $domains. Continue and replace existing certificate ? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
        exit
    fi
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
ssh -i $remote mkdir -p "$data_path/www"
ssh -i $remote mkdir -p "$data_path/conf/live/$domains"
ssh -i $remote mkdir -p "$data_path/conf/archive/$domains"

docker-compose -f docker-compose.production.yml run --user root --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout $path/privkey.pem \
    -out $path/fullchain.pem \
    -subj '/CN=$domains' \
    && chgrp -R nodecert $path/conf/live && chmod -R 755 $path/conf/live \
    && chgrp -R nodecert $path/conf/archive && chmod -R 755 $path/conf/archive
    " api
echo

docker-compose -f docker-compose.production.yml up --force-recreate -d api
docker-compose -f docker-compose.production.yml exec --user root -it api "/etc/init-create-nodecert-group.sh"

# echo "### Creates group nodecert and asign users to them in both api and web containers ..."
#     docker-compose -f docker-compose.production.yml run --user root --rm --entrypoint "/etc/init-create-nodecert-group.sh" api
#     docker-compose -f docker-compose.production.yml run --user root --rm --entrypoint "/etc/init-create-nodecert-group.sh" web
# echo

echo "### Change permission to fullchain.pem and privkey.pem on the host"
ssh -i $remote "chmod -R 755 $data_path/conf/live && chmod -R 755 $data_path/conf/archive"
echo

if [ $env == "1" ] || [ $env == "2" ]; then
    if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
        echo "### Downloading recommended TLS parameters ..."
        echo "mkdir -p $data_path
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > $data_path/conf/options-ssl-nginx.conf
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > $data_path/conf/ssl-dhparams.pem" | ssh -t -i $remote 
        echo
    fi

    echo "### Starting nginx ..."
    docker-compose -f docker-compose.production.yml up --force-recreate -d web
    docker-compose -f docker-compose.production.yml exec --user root -it web "/etc/init-create-nodecert-group.sh"
    echo

    echo "### Deleting dummy certificate for $domains ..."
    docker-compose -f docker-compose.production.yml exec --user root -it web rm -Rf /etc/letsencrypt/live/$domains && rm -Rf /etc/letsencrypt/archive/$domains && rm -Rf /etc/letsencrypt/renewal/$domains.conf
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

    docker-compose -f docker-compose.production.yml exec --user root -it web certbot certonly -v --webroot -w $webroot $staging_arg $email_arg $domain_args --rsa-key-size $rsa_key_size --agree-tos --force-renewal
    echo

    echo "### Change permission to fullchain.pem and privkey.pem on the host"
    ssh -i $remote "chmod -R 755 $data_path/conf/live && chmod -R 755 $data_path/conf/archive"
    echo

    echo "### Rebuilding backend container ..."    
    docker-compose -f docker-compose.production.yml run --user root --rm --entrypoint "/etc/init-create-nodecert-group.sh" api

    echo "### Reloading nginx ..."    
    docker-compose -f docker-compose.production.yml exec web nginx -s reload
fi

echo "### Setup finished successfully!"
echo "### Run ""docker-compose -f docker-compose.production.yml up -d"" to start services."