# Camera · [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sswahn/camera/blob/main/LICENSE) ![npm version](https://img.shields.io/npm/v/@sswahn/camera) ![Weekly Downloads](https://img.shields.io/npm/dw/@sswahn/camera) ![GitHub stars](https://img.shields.io/github/stars/sswahn/camera?style=social)
Camera provides a set of methods for managing video and audio streams from a device's camera and microphone. This library offers functionalities like starting/stopping the camera, toggling the light, muting audio, capturing photos, and recording videos.  

## Features
- Start and stop the device's camera with custom constraints.
- Capture still photos from the video stream.
- Record video clips.
- Toggle camera light (if supported by the device).
- Mute and unmute audio.

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
const stream = await camera.on(optionalConstraints)
```

### Display The Stream   
```javascript
videoRef.current.srcObject = stream
...
<video ref={videoRef} autoPlay muted></video>
```

### Take Photos  
```javascript
const videoElement = videoRef.current
const blob = await camera.takePhoto(videoElement)
```

### Start Recording  
```javascript
const frames = []
const recorder = camera.startRecording(stream, frames)
```  

### Stop Recording    
```javascript
const blob = await camera.stopRecording(recorder, frames)
```  

### Turn The Camera Off  
```javascript
camera.off(stream)
```

### Turn On Light  
```javascript
camera.light(stream)
```

### Turn Off Light  
```javascript
camera.dark(stream)
```

### Mute Audio  
```javascript
camera.mute(stream)
```

### Unmute Audio  
```javascript
camera.unmute(stream)
```

## License
Camera is [MIT Licensed](https://github.com/sswahn/camera/blob/main/LICENSE)
