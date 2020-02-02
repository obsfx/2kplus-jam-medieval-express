#!/bin/bash

tool_dir="./tools/spritesheet_to_binary.py"
sprites_dir="./assets/sprites.png"

python3 $tool_dir $sprites_dir > ./assets/sprites.txt