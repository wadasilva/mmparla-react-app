#!/bin/bash
echo "Creating groups"
/etc/init-create-nodecert-group.sh

echo "Changing user to app and starting node"
sudo -u app node index.js &