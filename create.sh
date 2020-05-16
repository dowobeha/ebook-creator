#!/bin/bash
if [ ! -e "$1" ]
	then
	printf "Drop a folder containing the following filenames\ndata.tsv\nmetadata.tsv\nimages\nfonts\ncss\njs\naudio\noutput"
	exit
fi
data=""
meta=""
images=""
fonts=""
css=""
js=""
audio=""
output=""
cd $1
for d in *; do
    if [ "data.tsv" == "$d" ]
	then
		data="$d"
	fi
	if [ "metadata.tsv" == "$d" ]
	then
		meta="$d"
	fi
	if [ "images" == "$d" ]
	then
		images="$d"
	fi
	if [ "fonts" == "$d" ]
	then
		fonts="$d"
	fi
	if [ "css" == "$d" ]
	then
		css="$d"
	fi
	if [ "js" == "$d" ]
	then
		js="$d"
	fi
	if [ "audio" == "$d" ]
	then
		audio="$d"
	fi
	if [ "output" == "$d" ]
	then
		output="$d"
	fi


done
ruby ../create.rb data meta images fonts css js audio output