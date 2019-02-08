#!/bin/bash

if [[ "$(which convert 2> /dev/null)" == "" ]]; then

	(>&2 echo -e "ERROR:\tThe imagemagick program \"convert\" is required, but was not found.")
	exit -1
	
fi

if [[ ! -d images-original ]]; then

	(>&2 echo -e "ERROR:\tThe directory \"images-original\" is required, but was not found.")
	exit -1
	
fi


mkdir -p imageScaled

for image in $(cd images-original &> /dev/null && ls -1 *.png) ; do

	convert images-original/${image} -resize 738x753 -background white -compose Copy -gravity center -extent 738x753 -quality 100 imageScaled/${image}

done
