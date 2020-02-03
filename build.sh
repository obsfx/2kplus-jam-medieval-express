#!/bin/bash
build_dir="./build"

if [ ! -d $build_dir ]; then
    mkdir $build_dir
fi

index_html=./index.html
merged_output=merged.js
merged_target=$build_dir/$merged_output

files=(
    ./src/vars.js
    ./src/util.js
    ./src/room.js
    ./src/controls.js
    ./src/sprites.js
    ./src/main.js
)

echo " " > $merged_target

for file in "${files[@]}"
do
    echo " " >> $merged_target
    echo "// ---------- $file" >> $merged_target
    echo "// ---------- " >> $merged_target
    cat $file >> $merged_target

    echo "... $file"
done

merged_packed_output=merged.html
merged_packed_target=$build_dir/$merged_packed_output

cat $index_html > $merged_packed_target
echo "<script>" >> $merged_packed_target
cat $merged_target >> $merged_packed_target
echo "</script>" >> $merged_packed_target

compiler=./tools/closure-compiler.jar
compilation_level=ADVANCED_OPTIMIZATIONS
input=$merged_target
compiled_output=compiled.js
compilation_output=$build_dir/$compiled_output

echo "closure compiler executed..."

java -jar $compiler --compilation_level $compilation_level --language_out=ECMASCRIPT6 --js $input --js_output_file $compilation_output

compiled_packed_output=compiled.html
compiled_packed_target=$build_dir/$compiled_packed_output

cat $index_html > $compiled_packed_target
printf "<script>" >> $compiled_packed_target
cat $compilation_output | tr -d "\n" >> $compiled_packed_target
printf "</script>" >> $compiled_packed_target

sed -e "s/'use strict';//g" -i $compiled_packed_target

echo "gzipping..."

final_output=./game.zip
advzip -a -4 ./game.zip $compiled_packed_target
zip_size=$(stat --format=%s $final_output)

echo "$final_output -> usage $zip_size/2048 bytes"
echo "$final_output -> usage: $(( $zip_size / (2048 / 100) ))%"

echo "done"