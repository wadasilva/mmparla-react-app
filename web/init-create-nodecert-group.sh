#!/bin/bash

# Creates nodecert group on host
TARGET_GID=$(stat -c "%g" /etc/letsencrypt)
EXISTS=$(cat /etc/group | grep :$TARGET_GID: | wc -l)

# Create new group using target GID and add app user
if [ $EXISTS == "0" ]; then
    groupadd -g $TARGET_GID nodecert
    sudo adduser root nodecert
    sudo adduser nginx nodecert || sudo adduser app nodecert || echo 'no app nor nginx user not available for this container'
else
    # GID exists, find group name and add
    GROUP=$(getent group $TARGET_GID | cut -d: -f1)
    sudo adduser root $GROUP
    sudo adduser nginx $GROUP || sudo adduser app $GROUP || echo 'no app nor nginx user not available for this container'
fi