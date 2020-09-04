let ready = false

export const isReady = () => {
  return new Promise((resolve, reject) => {
    if (!window) {
      reject(Error('Missing window'))
    }
    if (ready) {
      resolve(true)
    }

    const sendAppReadyMessage = () => {
      window.postMessage(
        { source: 'app', event: 'ready' },
        window.location.origin
      )
    }

    // Send ready message until decorator responds
    ;(function wait() {
      if (!ready) {
        setTimeout(wait, 500)
        sendAppReadyMessage()
      }
    })()

    const receiveMessage = ({ data }: MessageEvent) => {
      const { source, event } = data
      if (source === 'decorator' && event === 'ready') {
        ready = true
        window.removeEventListener('message', receiveMessage, false)
        resolve(true)
      }
    }
    window.addEventListener('message', receiveMessage, false)
  })
}
