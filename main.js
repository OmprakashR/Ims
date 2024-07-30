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
.then(function(stream) {
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    
    if (capabilities.whiteBalanceMode) {
        track.applyConstraints({ whiteBalanceMode: 'manual', whiteBalanceValue: 5500 }); // Adjust the value as needed
    }

    video.srcObject = stream;
})
.catch(function(error) {
    console.log(error);
});

// Capture the image when the button is clicked
captureButton.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // (No color correction needed here)
    
    // Create an image element to display the captured photo
    const imageUrl = canvas.toDataURL('image/png');
    output.src = imageUrl;
});
