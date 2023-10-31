const camera = {
  async on(constraints = {}) {
    const defaultConstraints = {
      audio: true,
      video: {
        facingMode: 'environment',
        aspectRatio: {
          ideal: window.innerWidth / window.innerHeight
        }
      }
    }
    const finalConstraints = {
      ...defaultConstraints,
      ...constraints,
      video: {
        ...defaultConstraints.video,
        ...constraints.video
      }
    }
    try {
      return navigator.mediaDevices.getUserMedia(finalConstraints)
    } catch (error) {
      throw new Error(`Error accessing camera. ${error}`)
    }
  },
  off(stream) {
    if (!stream || typeof stream !== 'object') {
      throw new TypeError('stop: Invalid argument. Expected MediaStream object.')
    }
    try {
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      throw new Error(`Error accessing camera. ${error}`)
    }
  },
  light(stream) {
    if (!stream || typeof stream !== 'object') {
        throw new TypeError('turnOnLight: Invalid arguments.')
    }
    let constraints = undefined
    const videoTracks = stream.getVideoTracks()
    if (!videoTracks.length) {
      throw new Error('No video tracks available.')
    }
    const videoTrack = videoTracks[0]
    // Check if the fillLightMode constraint is supported
    if (videoTrack.getCapabilities().hasOwnProperty('fillLightMode')) {
        constraints = { fillLightMode: 'flash' }
    }
    // Check if the torch constraint is supported
    if (videoTrack.getCapabilities().hasOwnProperty('torch')) {
        constraints = { advanced: [{ torch: true }] }
    }
    if (!constraints) {
        throw new Error('This device has no torch.')
    }
    // Turn on the camera light
    return videoTrack.applyConstraints(constraints)
  },
  dark(stream) {
    if (!stream || typeof stream !== 'object') {
        throw new TypeError('turnOffLight: Invalid arguments.')
    }
    let constraints = undefined
    const videoTracks = stream.getVideoTracks()
    if (!videoTracks.length) {
      throw new Error('No video tracks available.')
    }
    const videoTrack = videoTracks[0]
    // Check if the fillLightMode constraint is supported
    if (videoTrack.getCapabilities().hasOwnProperty('fillLightMode')) {
        constraints = { fillLightMode: 'off' }
    }
    // Check if the torch constraint is supported
    if (videoTrack.getCapabilities().hasOwnProperty('torch')) {
        constraints = { advanced: [{ torch: false }] }
    }
    if (!constraints) {
        throw new Error('This device has no torch.')
    }
    // Turn off the camera light
    return videoTrack.applyConstraints(constraints)
  },
  async takePhoto(videoElement) {
    if (!videoElement || typeof videoElement !== 'object') {
      throw new TypeError('takePhoto: Invalid argument. Expected video element reference.')
    }
    return new Promise((resolve, reject) => {
      const video = videoElement
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => blob ? resolve(blob) : reject('Failed to create blob from canvas.'), 'image/webp', 1)
    })
  },
  mute(stream) {
    if (!stream || typeof stream !== 'object') {
        throw new TypeError('mute: Invalid arguments.')
    }
    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) {
        throw new Error('No audio tracks found.')
    }
    audioTracks.forEach(track => {
        track.enabled = false;
    })
  },
  unmute(stream) {
    if (!stream || typeof stream !== 'object') {
        throw new TypeError('unmute: Invalid arguments.')
    }
    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) {
        throw new Error('No audio tracks found.')
    }
    audioTracks.forEach(track => {
        track.enabled = true;
    })
  },
  startRecording(stream, frames) {
    if (!stream || typeof stream !== 'object') {
      throw new TypeError('startRecording: Invalid argument. Expected stream.')
    }
    if (!frames || typeof frames !== 'object') {
      throw new TypeError('startRecording: frames is not initialized or not an object.')
    }
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    mediaRecorder.ondataavailable = event => {
      frames.push(event.data)
    }
    mediaRecorder.start()
    return mediaRecorder
  },
  stopRecording(mediaRecorder, frames) {
    if (!mediaRecorder || typeof mediaRecorder !== 'object') {
      throw new TypeError('stopRecording: mediaRecorderRef is not initialized or not an object.')
    }
    if (!frames || typeof frames !== 'object') {
      throw new TypeError('stopRecording: frames is not initialized or not an object.')
    }
    return new Promise((resolve, reject) => {
      try {
        mediaRecorder.onstop = async () => {
          const blob = new Blob(frames, { type: 'video/webm' })
          frames.length = 0
          resolve(blob)
        }
        mediaRecorder.onerror = event => {
          reject(`Recording error: ${event.error}`)
        }
        mediaRecorder.stop()
      } catch (error) {
        throw new Error(`Error accessing camera. ${error}`)
      }
    })
  }
}

export default camera
