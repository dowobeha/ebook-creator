#!/bin/bash

# file=complex.epub
# 
# clear
# 
# rm -f ${file}
# 
# zip -X ${file} mimetype
# 
# zip -rg ${file} META-INF -x \*.DS_Store
# 
# zip -rg ${file} OEBPS -x \*.DS_Store
# 
# open ${file}

./createWordLevel.rb dataWordLevelIPA.tsv metadata.tsv images fonts css OEBPS/js audio Kulusiinkut_IPA
