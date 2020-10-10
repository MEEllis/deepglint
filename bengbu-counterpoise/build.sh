#!/bin/bash

set -e

version=$1
if [ "$1" == "" ]; then
    echo "Version not found, perform snapshot build"
    version=`date +%Y%m%d%H%M%S`
fi

dir=$PWD
projectName=jormougand-bengbu
targetFolder=$projectName-$version
targetFile=$targetFolder.tar.gz

echo "ln -s $projectName/$targetFolder $projectName/latest"

echo "prepare..."
rm -rf $projectName
mkdir $projectName

echo "build..."
npm run build
echo $version > dist/version.txt

echo "mv..."
mv dist $projectName/$targetFolder
cd $projectName
ln -s $targetFolder latest
cd $dir

echo "tar..."
tar -zcvf $targetFile $projectName &>/dev/null

echo "clean..."
rm -rf $projectName

echo "build done"
echo $version
