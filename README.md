# Camera 
Camera provides a set of helper functions for managing video and audio streams from a device's camera and microphone. This library offers functionalities like starting/stopping the camera, toggling the light, muting audio, capturing photos, and recording videos.  

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

### Turn The Camera On  
```javascript
const stream = await camera.turnOn(constraints)
```

### Turn The Camera Off  
```javascript
camera.turnOff(stream)
```

### Turn On Light  
```javascript
camera.lightOn(stream)
```

### Turn Off Light  
```javascript
camera.lightOff(stream)
```

### Mute Audio  
```javascript
camera.mute(stream)
```

### Unmute Audio  
```javascript
camera.unmute(stream)
```

### Take Photos  
```javascript
const blob = await camera.takePhoto(video)
```

### Start Recording  
```javascript
const chunks = []
const mediaRecorder = camera.startRecording(stream, chunks)
```  

### Stop Recording    
```javascript
const blob = await camera.stopRecording(mediaRecorder)
```  

## License
Server is [MIT Licensed](https://github.com/sswahn/server/blob/main/LICENSE)
