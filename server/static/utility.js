async function req() {
    const response = await fetch(dispdataUrl, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const arrayBuffer = await response.arrayBuffer();
    data = new Uint8Array(arrayBuffer);
    return data;
}

async function getbytes() {
    try {
        byteArray = await req();
        start = 0;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function readFileData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            // Read the file data as an ArrayBuffer
            const arrayBuffer = event.target.result;
            // Convert the ArrayBuffer to Uint8Array to get the byte array
            const filedata = new Uint8Array(arrayBuffer);

            // Call the resolve function to indicate that the file reading is complete
            resolve(filedata);
        };

        reader.onerror = function() {
            reject(reader.error);
        };

        // Read the file data from the Blob (file) in the FormData
        reader.readAsArrayBuffer(file);
    });
}

async function postFile(file) {
    let filedata;
    try {
        filedata = await readFileData(file);
    } catch (error) {
        alert('Error reading file data:', error);
        return;
    }

    try {
        const response = await fetch(postUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/octet-stream'
            },
            body: filedata
        });

        status = response.status;
        data = await response.json();

        if (status >= 200 && status < 300) {
            byteArray = filedata;
        }
        else alert(data['message']);
    } catch(error) {        
        console.error('Error:', error);
    }
}

async function sendVal(url) {
    const response = await fetch(url, {
        method: 'GET',
    });

    if (!response.ok) console.log("Error sending data.");

    else if (response.status < 200 || response.status >= 300)
        alert("Error: couldn't change value on the server.");
    else {
        data = await response.json();
        console.log("Server: " + data['message']);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function speedToDelay() {
    // delay beetween 10ms to 1000ms
    // y = mx + c
    // line through (1, maxDelay) ans (maxSpeed, minDelay)
    let m = (minDelay - maxDelay) / (maxSpeedValue - 1);
    let c = maxDelay - m;
    return Math.floor(m * speed + c);
}
