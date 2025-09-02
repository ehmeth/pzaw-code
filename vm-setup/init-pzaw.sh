#!/usr/bin/env bash

# Variables

VS_CODE_COMMIT_ID=6f17636121051a53c88d3e605c491d22af2ba755

echo Basic system update and upgrade
echo ===============================

sudo apt update
sudo apt upgrade -y

echo SSH server config
echo =================

if systemctl status ssh > /dev/null 2>&1 ; then
    echo ssh server is installed
else
    sudo apt install openssh-server -y
    sudo systemctl enable ssh
    sudo ufw allow ssh
    sudo systemctl restart ssh
fi

echo Necessary apt packages
echo ======================

sudo apt install \
    git \
    silversearcher-ag \
    nnn \
    -y

echo Install npm version manager and node+npm
echo ========================================

if [ ! -d $HOME/.nvm ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    nvm install --lts
    nvm install-latest-npm
fi

echo npm cache warmup
echo ================

mkdir temp-app
pushd temp-app
npm init -y > /dev/null
npm install express ejs morgan cookie-parser > /dev/null
npm install --save-dev prettier eslint eslint-config-prettier globals
npm install> /dev/null
popd
rm -rf temp-app

echo install VS Code server
echo ======================


rm -rf .vscode-server
mkdir -p .vscode-server/bin/$VS_CODE_COMMIT_ID
if [ ! -f tools/vscode-server-$VS_CODE_COMMIT_ID.tgz ]; then
    wget -q -O tools/vscode-server-$VS_CODE_COMMIT_ID.tgz https://update.code.visualstudio.com/commit:$VS_CODE_COMMIT_ID/server-linux-x64/stable
fi
tar -zxf tools/vscode-server-$VS_CODE_COMMIT_ID.tgz --directory .vscode-server/bin/$VS_CODE_COMMIT_ID --strip-components 1

echo Install required VS Code extensions
echo ===================================

codeserver=~/.vscode-server/bin/$VS_CODE_COMMIT_ID/bin/code-server

if [ -e $codeserver ]; then
    xargs -n 1 $codeserver --install-extension <<- EOF
        dbaeumer.vscode-eslint
        esbenp.prettier-vscode
EOF
fi

echo Done. PZAW env configured
