const camera = {
  async on(constraints = {}) {
    if (typeof constraints !== 'object' || Array.isArray(constraints)) {
      throw new TypeError('on: argument must be an object literal.')
    }
    const defaultConstraints = {
      audio: {
        echoCancellation: true,
        sampleRate: 48000
      },
      video: {
        facingMode: 'environment',
        aspectRatio: {
          ideal: window.innerWidth / window.innerHeight
        }
      }
    }
    const finalConstraints = {
      ...defaultConstraints,
      ...constraints
    }
    try {
      return navigator.mediaDevices.getUserMedia(finalConstraints)
    } catch (error) {
      throw new Error(`Error accessing camera. ${error}`)
    }
  },
  off(stream) {
    if (!(stream instanceof MediaStream)) {
      throw new TypeError('stop: argument must be an instance of MediaStream.')
    }
    try {
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      throw new Error(`Error accessing camera. ${error}`)
    }
  },
  light(stream) {
    if (!(stream instanceof MediaStream)) {
      throw new TypeError('light: argument must be an instance of MediaStream.')
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
    if (!(stream instanceof MediaStream)) {
      throw new TypeError('dark: argument must be an instance of MediaStream.')
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
    if (!(videoElement instanceof HTMLVideoElement)) {
      throw new TypeError('takePhoto: argument must be an instance of HTMLVideoElement.')
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
    if (!(stream instanceof MediaStream)) {
      throw new TypeError('mute: argument must be an instance of MediaStream.')
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
    if (!(stream instanceof MediaStream)) {
      throw new TypeError('unmute: argument must be an instance of MediaStream.')
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
    if (!(stream instanceof MediaStream)) {
      throw new TypeError('startRecording: first argument must be an instance of MediaStream.')
    }
    if (!Array.isArray(frames)) {
      throw new TypeError('startRecording: second argument must be an array.')
    }
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9,opus' })
    mediaRecorder.ondataavailable = event => {
      frames.push(event.data)
    }
    mediaRecorder.start()
    return mediaRecorder
  },
  stopRecording(mediaRecorder, frames) {
    if (!(mediaRecorder instanceof MediaRecorder)) {
      throw new TypeError('stopRecording: first argument must be an instance of MediaRecorder.')
    }
    if (!Array.isArray(frames)) {
      throw new TypeError('stopRecording: second argument must be an array.')
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
