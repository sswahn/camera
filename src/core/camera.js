// returns stream
export const startCamera = async () => {
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
    console.error('Error accessing camera.')
  }
}

export const stopCamera = stream => {
  if (!stream) {
    throw new Error('stopCamera: requires an argument.')
  }
  // type check stream?
  
  stream.getTracks().forEach(track => track.stop())
}

export const handleTurnOnLight = (srcObject, light) => {
  // type check arguments?
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
    return alert('This device has no torch.')
  }

  // Turn on the camera light
  videoTrack.applyConstraints(constraints).catch(error => {
    console.error('Unable to turn on camera light: ', error)
  })
    
  return !light
}

export const toggleMute = (srcObject, mute) => {
  const mediaStream = srcObject
  const audioTracks = mediaStream.getAudioTracks()
  if (audioTracks.length === 0) {
    return alert('No audio tracks found.')
  }
  audioTracks.forEach(track => {
    track.enabled = mute // set enabled as false to mute
  })
  return !mute
}

export const handleTakePhoto = async videoRef => {
  return new Promise((resolve, reject) => {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => resolve(blob), 'image/webp', 1)
  })
}

export const handleRecordVideo = async srcObject => {
  return new Promise((resolve, reject) => {
    const mediaRecorder = new MediaRecorder(
      srcObject,
      { mimeType: 'video/webm' }
    )
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.ondataavailable = event => {
      chunksRef.current.push(event.data)
    }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      chunksRef.current = []
      resolve(blob)
    }
    mediaRecorder.start()
  })
}

export const handleStopRecordVideo = () => {
  timerRef.current = timer
  mediaRecorderRef.current.stop()
}
