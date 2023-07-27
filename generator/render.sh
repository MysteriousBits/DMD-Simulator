#!/bin/bash

convert -threshold 20% -depth 1 -background white -fill black \
	-pointsize 16 -font ./fnt.ttf label:@txt.txt tmp.png
convert -crop -0-1 tmp.png tmp.png
#convert -threshold 40% -depth 1 -adaptive-resize x16 tmp.png tmp.png
