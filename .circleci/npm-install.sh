#!/bin/bash
root_dir=$(pwd)
set -e
source ~/.bashrc

echo "Node and Npm Version:"
node -v
npm -v

npm install -g typescript

if [ -f package.jsons ]; then
    npm install --save --save-exact
fi

for folder in $(ls)
  do
   if [ -f $folder/package.json ]; then
      echo "package.json exists in $folder"
      echo "Running npm install on $folder"
      cd $folder && npm install --save --save-exact && cd ..
   fi
  done

npm run compile