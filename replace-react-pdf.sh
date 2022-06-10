#!/bin/bash

git clone git@github.com:rasmusrim/react-pdf.git
cd react-pdf || exit
git checkout 1878
yarn install
yarn bootstrap
yarn build
cd ..
rm -rf node_modules/@react-pdf
cd node_modules || exit
ln -s ../react-pdf/packages @react-pdf
cd ..


