#!/bin/bash

convert -threshold 20% -depth 1 -background white -fill black pango:@txt.txt tmp.png
convert -crop -0-8 tmp.png tmp.png
convert -depth 1 -adaptive-resize x16 tmp.png tmp.png
