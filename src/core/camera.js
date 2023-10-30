// returns promise of a stream
export const startCamera = () => {
  try {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'environment',
        aspectRatio: {
          ideal: window.innerWidth / window.innerHeight
        }
      }
    })
  } catch (error) {
    throw new Error(`Error accessing camera. ${error}`)
  }
}

export const stopCamera = stream => {
  if (!stream || typeof stream !== 'object') {
    throw new TypeError('stopCamera: Invalid argument. Expected MediaStream object.')
  }
  try {
    stream.getTracks().forEach(track => track.stop())
  } catch (error) {
    throw new Error(`Error accessing camera. ${error}`)
  }
}

export const handleTurnOnLight = (srcObject, light) => {
  if (!srcObject || typeof srcObject !== 'object' || typeof light !== 'boolean') {
    throw new TypeError('handleTurnOnLight: Invalid arguments.')
  }
  const videoTrack = srcObject.getVideoTracks()[0]
  let constraints = undefined
    
  console.log('capabilities: ', videoTrack.getCapabilities())
    
  // Check if the fillLightMode constraint is supported
  if (videoTrack.getCapabilities().hasOwnProperty('fillLightMode')) {
    constraints = { fillLightMode: !light ? 'flash' : 'off' }
  }
  // Check if the torch constraint is supported
  if (videoTrack.getCapabilities().hasOwnProperty('torch')) {
    constraints = { advanced: [{ torch: !light }] }
  }
    
  console.log('constraints: ', constraints)
    
  if (!constraints) {
    throw new Error('This device has no torch.')
  }

  // Turn on the camera light
  videoTrack.applyConstraints(constraints).catch(error => {
    console.error('Unable to turn on camera light: ', error)
  })
    
  return !light
}

export const toggleMute = (srcObject, mute) => {
  if (!srcObject || typeof srcObject !== 'object' || typeof mute !== 'boolean') {
    throw new TypeError('toggleMute: Invalid arguments.')
  }
  const mediaStream = srcObject
  const audioTracks = mediaStream.getAudioTracks()
  if (audioTracks.length === 0) {
    throw new Error('No audio tracks found.')
  }
  audioTracks.forEach(track => {
    track.enabled = mute // set enabled as false to mute
  })
  return !mute
}

export const handleTakePhoto = async videoRef => {
  if (!videoRef || typeof videoRef.current !== 'object') {
    throw new TypeError('handleTakePhoto: Invalid argument. Expected videoRef object.')
  }
  return new Promise((resolve, reject) => {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => blob ? resolve(blob) : reject('Failed to create blob from canvas.'), 'image/webp', 1)
  })
}

export const handleRecordVideo = async (srcObject, mediaRecorderRef, chunksRef) => {
  if (!srcObject || typeof srcObject !== 'object') {
    throw new TypeError('handleRecordVideo: Invalid argument. Expected srcObject.')
  }
  return new Promise((resolve, reject) => {
    const mediaRecorder = new MediaRecorder(
      srcObject,
      { mimeType: 'video/webm' }
    )
    
    mediaRecorderRef = mediaRecorder
    
    mediaRecorder.ondataavailable = event => {
      chunksRef.push(event.data)
    }
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      chunksRef = []
      resolve(blob)
    }
    mediaRecorder.onerror = event => {
      reject(`Recording error: ${event.error}`)
    }
    
    mediaRecorder.start()
  })
}

export const handleStopRecordVideo = mediaRecorderRef => {
  if (!mediaRecorderRef || typeof mediaRecorderRef.current !== 'object') {
    throw new TypeError('handleStopRecordVideo: mediaRecorderRef is not initialized or not an object.')
  }
  try {
    mediaRecorderRef.current.stop()
  } catch (error) {
    console.error(`Error accessing camera. ${error}`)
  }
}
