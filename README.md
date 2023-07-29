# DMD-Simulator

## Table of Contents
- [Introduction](#introduction)
- [How to Run](#how-to-run)
- [Generator](#generator)
- [Rendering Bangla](#rendering-bangla)
- [Web App Details](#web-app-details)
- [Using with a Real Display](#using-with-a-real-display)
- [Redndering Mechanism](#rendering-mechanism)
- [Further Development](#further-development)

![GUI screenshot](https://raw.githubusercontent.com/MysteriousBits/DMD-Simulator/main/screenshot.png)

## Introduction
DMD-Simulator is a simple web app for simulating led dot matrix display and changing text in real time which can also be used for controlling a real display.    

It simulates a 64x16 (two 16x32) P10 LED displays. It provides a web-based interface to set and change different parameters, and it includes components for the frontend, backend and a generator script for converting text to bytearray containing pixel data for LED display rendering. The main purpose of the project is to add real time full control over a real display from anywhere and test the stuffs before taking the hassles of implementing in real life.

## How to Run
To run the DMD-Simulator, follow these steps:
1. Clone the repository: `git clone https://github.com/MysteriousBits/DMD-Simulator.git`
2. Navigate to the project directory: `cd DMD-Simulator`
3. Install dependencies for python server and generator: `pip install -r requirements.txt`
4. Run the flask web server:
    ``` sh
    cd server
    python app.py
    ```
5. Open a web browser and go to the url http://localhost:8000/ and test. Can be accessed using `<ip>:8000` from other devices.
6. To change the text, generate display data using the generator script(See below for details). Then upload the file in the app and hit "Change Text".    

**For Windows User:** If you are on windows, to use the generator, you must install [Imagemagick](https://imagemagick.org/index.php) first and add it to PATH. Then you have to replace the command `convert` with `magick` in `render.sh` and rename the shell scripts (`*.sh`) to `*.bat`.

## Generator
The generator is a separate component responsible for rendering and converting text into a bytearray containing pixel data for LED display rendering. It uses *imagemagick* to render text into a image of height **16px** and then use python *pillow* to process the pixels and convert into binary file.  
To generate a display data(.dmd) file:
1. Go to the generator directory.
2. Modify the `txt.txt` file, which will be shown.
3. Run `./run.sh`. The file should be generated and saved in `output/dispdata.dmd`. You can also run the `render.sh` and `gen.py` seperately: `python gen.py <image_file> <output_filename>`.

To use custom font, replace the `fnt.ttf` file with your font or modify the `render.sh` script. The main challenge here is that the display is very low in resolution and only supports 0 or 1(black and white 1-bit image) for setting leds which is indeed our pixels. So it is hard to render sharp and clean text with complex fonts. So the best way to handle this is using a 16 bit bitmap font, which perfectly matches with the pixel grid. Note that you may need to modify the font size and crop value in the `render.sh` to match the image size as `width x 16`.

### Rendering Bangla
A sample script is given in `gen_bangla/`. As Bangla letters are much complex, it is hard to make them fit in 16px image. Here I've found the best result with `pango` library and *"ShurmaMJ"* bijoy font as I couldn't find any 16 bit bitmap font for Bangla. So it will be highly appreciated **if someone designs one!**

### Web App Details:
**Frontend:** The frontend of the DMD-Simulator includes basic HTML, CSS, and JavaScript components for rendering the virtual LED display on the web browser. Besides the scripts are completely ready to communicate with a real display running with some sort of microcontroller and wifi module.
    
**Backend:** The backend is mainly written to act as a fake display running behind which can be controlled. Also you can use the server for testing purposes. The backend uses python `flask` for handling HTTP requests and serving display datas. Basically it is an example code for implementing the server side operations while working with a real display.
    
A major part of the UI is generated with chatGPT!

## Using with a Real Display
You need a microcontroller and a wifi moude to control a P10 display in this project. You may use arduino and esp8266 module for example. Although the simulator is for two 16x32 display, you can use more or less as well. In that case you need to handle it in your code.    

You have to host a server on your wifi module and serve the frontend parts to the client. The important part is to handle the http requests on the server side and act accordingly. You can get an idea looking at `main.py`. You need to handle the following requests:
- `/get/dispdata`: Send the current display data.
- `/post/dispdata`: Change the current display data.
- `/set/delay?value=x`: Change speed of scrolling. `x` is integer.
- `/set/step?value=x`: Change the number of skipped coloumns while rendering. `x` is integer.
- `/set/random`: Glow the display randomly if you want.
- `/set/scroll?state=x`: Change the scrolling state of display. `x` is either 0 or 1.
See rendering mechanism below for knowing in details about rendering the datas in display.
  
Note: If you don't use a sd card with arduino(to store the static files) or can't serve the frontend parts from your server, you may need to run the web-app directly from the client side. While doing so make sure to **replace the urls** on `server/static/global.js` with the absolute urls of server. For example `const dispdataUrl = http://192.168.0.101:8000/get/dispdata`.

## Rendering Mechanism
The generator works in this way:  
user text input -> render text into image -> crop or resize to fit 16px -> convert to 1-bit image -> extract pixels as bit matrix -> encode the matrix into a bytearray.  
We achieve this through some image processing with imagemagick and python pillow. Then the rendering process in display is like this:  
read the bytearray ->  decode into bit matrix -> render pixel by pixel.
    
Now to decode or access a pixel directly from the encoded array, we need to know the encoding algorithm or the relation between the pixel position and bit position along with the byte index.
If a pixel is on the i<sup>th</sup> row and j<sup>th</sup> coloumn, the formula is like this:
```
pixel[i, j] = byteArray[2 * j + floor(i / 8)] | (1 << (i mod 8))
```

Basically we iterate the matrix coloumn by coloumn while encoding. Then we put the first 8 bits into a new byte (from LSB to MSB) and the second 8 bits into another. You should do the same when you set the pixels in your display. Here is a visual representation:  
![Encoding Matrix](https://raw.githubusercontent.com/MysteriousBits/DMD-Simulator/main/encode.png)

## Further Development
This project can be extended in several ways:
- Integrating with real LED display and arduino, as mentioned earlier.
- Modifying the app to send pixel datas directly after taking string input from user through gui instead of using generator script seperately each time.
- Adding animations or effects to the display.
- Designing a 16 bit font for your own language if you don't have one yet!
  
Feel free to contribute to the project and add new features or improvements if you want.
