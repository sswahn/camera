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

### Starting the Camera  
```javascript
import { startCamera } from '@sswahn/camera'

const stream = await startCamera()
// Now you can set this stream as the source for a video element.
```

### Stopping the Camera  
```javascript
import { stopCamera } from '@sswahn/camera'

stopCamera(stream)
```

### Toggle Camera Light  
```javascript
import { handleTurnOnLight } from '@sswahn/camera'

handleTurnOnLight(stream, true)  // Turns on the light
handleTurnOnLight(stream, false) // Turns off the light

```

### Mute and Unmute Audio  
```javascript
import { toggleMute } from '@sswahn/camera'

toggleMute(stream, true)  // Mutes the audio
toggleMute(stream, false) // Unmutes the audio

```

### Capture Photos  
For any request, you can provide custom headers:  
```javascript
import { handleTakePhoto } from '@sswahn/camera'

const blob = await handleTakePhoto(videoRef)
// You can now use this blob to display the image or save it.

```

### Record Videos  
```javascript
import { handleRecordVideo, handleStopRecordVideo } from '@sswahn/camera'

const chunksRef = [];
const mediaRecorderRef = await handleRecordVideo(stream, chunksRef)
// ... recording ...
handleStopRecordVideo(mediaRecorderRef)
```  

## License
Server is [MIT Licensed](https://github.com/sswahn/server/blob/main/LICENSE)
