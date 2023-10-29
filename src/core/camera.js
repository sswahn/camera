// camera.js

export const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'environment',
        aspectRatio: {
          ideal: window.innerWidth / window.innerHeight
        }
      }
    });
    return stream;
  } catch (error) {
    console.error('Error accessing camera.');
    return null;
  }
};

export const stopCamera = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const handleTurnOnLight = (videoRef, light) => {
  //... (as is from your code)
};

export const toggleMute = (videoRef, mute) => {
  //... (as is from your code)
};

export const handleTakePhoto = async (videoRef) => {
  //... (as is from your code)
  // Return the blob or base64 instead of using context
};

export const handleRecordVideo = async (videoRef) => {
  //... (as is from your code)
  // Return blob or base64 instead of using context
};

export const handleStopRecordVideo = () => {
  //... (as is from your code)
};
