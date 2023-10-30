# Camera 
A JavaScript utility library that provides a set of helper functions for managing video and audio streams from a device's camera and microphone. This library offers functionalities like starting/stopping the camera, toggling the light, muting audio, capturing photos, and recording videos.  

## Features
- Start and stop the device's camera with custom constraints.
- Toggle camera light (if supported by the device).
- Mute and unmute audio.
- Capture still photos from the video stream.
- Record video clips.

## Installation
Using npm:
```bash
npm install @sswahn/camera
```

## Usage  
Here's a brief overview of the functionalities provided:  

### Import Camera  
```javascript
import camera from '@sswahn/camera'
```  

### Starting the Camera  
```javascript
const stream = await camera.start()
// Now you can set this stream as the source for a video element.
```

### Stopping the Camera  
```javascript
camera.stop(stream)
```

### Toggle Camera Light  
```javascript
camera.turnOnLight(stream, true)  // Turns on the light
camera.turnOnLight(stream, false) // Turns off the light
```

### Mute and Unmute Audio  
```javascript
camera.mute(stream)  // Mutes the audio
camera.unmute(stream) // Unmutes the audio
```

### Capture Photos  
For any request, you can provide custom headers:  
```javascript
const blob = await camera.takePhoto(videoRef.current)
// You can now use this blob to display the image or save it.
```

### Record Videos  
```javascript
const chunksRef = []
const mediaRecorderRef = await camera.startRecording(stream, chunksRef)
// ... recording ...
camera.stopRecord(mediaRecorderRef)
```  

## License
Server is [MIT Licensed](https://github.com/sswahn/server/blob/main/LICENSE)
