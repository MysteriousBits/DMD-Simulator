document.addEventListener('DOMContentLoaded', async () => {
    const displayContainer = document.querySelector('.display');
    const scrollButton = document.querySelector('#scrollButton');
    const randomGlowButton = document.querySelector('#randomGlowButton');

    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    speedSlider.max = maxSpeedValue;
    speedSlider.value = speed;
    speedValue.textContent = speed;

    const stepSlider = document.getElementById('stepSlider');
    const stepValue = document.getElementById('stepValue');
    stepSlider.value = step;
    stepValue.textContent = step;

    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const changeButton = document.getElementById('changeButton');

    // Create a 64x16 virtual pixel array (all pixels initially off)
    let virtualPixels = Array.from({ length: 16 }, () => Array(64).fill(false));

    // Function to update a single pixel
    function updatePixel(x, y) {
        const pixelIndex = y * 64 + x;
        const pixelElement = displayContainer.children[pixelIndex];
        pixelElement.className = 'pixel ' + (virtualPixels[y][x] ? 'on' : 'off');
    }

    // Function to update the virtual pixel state
    function setPixelState(x, y, state) {
        if (x >= 0 && x < 64 && y >= 0 && y < 16) {
            virtualPixels[y][x] = state;
            updatePixel(x, y);
        }
    }

    // Function to initialize the display with virtual pixel states
    function initializeDisplay() {
        displayContainer.innerHTML = '';

        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 64; x++) {
                const pixel = document.createElement('div');
                pixel.classList.add('pixel');
                pixel.classList.add(virtualPixels[y][x] ? 'on' : 'off');
                displayContainer.appendChild(pixel);
            }
        }
    }

    function render() {
        for (let i = 0; i < 64; i++)
        {
            for (let j = 0; j < 16; j++)
            {
                let col = (start + 2 * i + Math.floor(j / 8)) % byteArray.length;
                let byte = byteArray[col];
                let bit = byte & (1 << (j % 8));
                setPixelState(i, j, bit);
            }
        }

        start = (start + 2 * step) % byteArray.length;
    }

    function clear() {
        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 16; j++) {
                setPixelState(i, j, false);
            }
        }
    }

    function random_glow() {
        for (let i = 0; i < 300; i++) {
            setPixelState(getRandomInt(0, 63), getRandomInt(0, 15), true);
        }
    }
    // Function to start the animation
    function startAnimation() {
        scrollButton.textContent = 'Stop Scrolling';
        intervalId = setInterval(render, speedToDelay());

        sendVal(scrollUrl + "?state=1");
    }

    // Function to stop the animation
    function stopAnimation() {
        if (!intervalId) return;

        scrollButton.textContent = 'Scroll Text';
        clearInterval(intervalId); // Stop the animation
        intervalId = undefined;

        sendVal(scrollUrl + "?state=0");
    }

    scrollButton.addEventListener('click', () => {
        if (intervalId) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    randomGlowButton.addEventListener('click', () => {
        stopAnimation();
        clear();
        random_glow();

        sendVal(randomUrl);
    });

    speedSlider.addEventListener('input', () => {
        speed = parseInt(speedSlider.value);
        speedValue.textContent = speed; // Update the displayed value of the speed
    });

    speedSlider.addEventListener('mouseup', () => {
        sendVal(delayUrl + `?value=${speedToDelay()}`);

        if (!intervalId) return;
        stopAnimation();
        startAnimation();

    });

    stepSlider.addEventListener('input', () => {
        step = parseInt(stepSlider.value);
        stepValue.textContent = step; // Update the displayed value of the speed
    });

    stepSlider.addEventListener('mouseup', () => {
        sendVal(stepUrl + `?value=${step}`);
    });

    document.getElementById('fileInput').addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            fileNameDisplay.textContent = fileName;
        } else {
            fileNameDisplay.textContent = 'Select file containing display data';
        }
    });

    changeButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }

        if (file.size > maxFileSize || file.size % 2 != 0) {
            alert("Invalid file. Select a .dmd file with size smaller than 1024 bytes.\n" +
                "Current file is " + file.name + " -> " + file.size + " bytes.");
            return;
        }

        await postFile(file);
        stopAnimation();
        render();

        fileNameDisplay.textContent = 'Select file containing display data';
    });

    // Initialize the display
    initializeDisplay();
    await getbytes();
    render();
});

