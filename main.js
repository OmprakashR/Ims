const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const output = document.getElementById('output');

// Set high-resolution canvas size
const highResWidth = 1920;
const highResHeight = 1080;
canvas.width = highResWidth;
canvas.height = highResHeight;

// Request access to the user's webcam with the back camera (if available) and high resolution
navigator.mediaDevices.getUserMedia({ 
    video: { 
        facingMode: { exact: "environment" },
        width: { ideal: highResWidth },
        height: { ideal: highResHeight }
    }
})
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    console.error("Error accessing the camera: ", err);
});

// Capture the image when the button is clicked
captureButton.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Invert the red and blue channels
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const blue = data[i + 2];
        data[i] = blue;
        data[i + 2] = red;
    }

    // Put the modified image data back to the canvas
    context.putImageData(imageData, 0, 0);

    // Create an image element to display the captured photo
    const imageUrl = canvas.toDataURL('image/png');
    output.src = imageUrl;
});
