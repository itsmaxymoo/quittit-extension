#!/bin/bash
rm -rdf dist
mkdir dist
cd src
zip -r -FS ../dist/build.zip *
cd ../