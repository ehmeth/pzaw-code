#!/usr/bin/env bash

# Variables

VS_CODE_COMMIT_ID=4437686ffebaf200fa4a6e6e67f735f3edf24ada

# Basic system update and upgrade

sudo apt update
sudo apt upgrade -y

# SSH server config

if systemctl status ssh > /dev/null 2>&1 ; then
    echo ssh server is installed
else
    sudo apt install openssh-server
    sudo systemctl enable ssh
    sudo ufw allow ssh
    sudo systemctl restart ssh
fi

# Necessary apt packages

sudo apt install \
    git \
    python3 \
    python3-pip \
    python3-venv \
    python-is-python3 \
    silversearcher-ag \
    nnn \
    -y

# Get clone Django from GitHub

if [ ! -d /opt/django ]; then
    sudo git clone https://github.com/django/django.git --branch 5.2 /opt/django

fi

if [ ! -d ~/tools/django ]; then
    mkdir -p ~/tools/django
    cp -r /opt/django/* ~/tools/django
fi

# Python venv for Django development

echo ~/tools/django > pzaw_requirements.txt

if [ ! -d ~/.venv/django ]; then
    python -m venv ~/.venv/django
    source ~/.venv/django/bin/activate
    pip install -r pzaw_requirements.txt
    deactivate
fi

# npm install

if [ ! -d $HOME/.nvm ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    nvm install node
fi

# npm cache warmup
npm install -g create-vue > /dev/null
create-vue --typescript --eslint --prettier temp-vue-app > /dev/null
pushd temp-vue-app
npm install > /dev/null
popd
rm -rf temp-vue-app

# install VS Code server


rm -rf .vscode-server
mkdir -p .vscode-server/bin/$VS_CODE_COMMIT_ID
if [ ! -f tools/vscode-server-$VS_CODE_COMMIT_ID.tgz ]; then
    wget -q -O tools/vscode-server-$VS_CODE_COMMIT_ID.tgz https://update.code.visualstudio.com/commit:$VS_CODE_COMMIT_ID/server-linux-x64/stable
fi
tar -zxf tools/vscode-server-$VS_CODE_COMMIT_ID.tgz --directory .vscode-server/bin/$VS_CODE_COMMIT_ID --strip-components 1

# install required VS Code extensions

codeserver=~/.vscode-server/bin/$VS_CODE_COMMIT_ID/bin/code-server

if [ -e $codeserver ]; then
    xargs -n 1 $codeserver --install-extension <<- EOF
        ms-python.python@2025.2.0
        batisteo.vscode-django@1.15.0
        vue.volar@2.2.8
EOF
fi

echo Done. PZAW env configured
