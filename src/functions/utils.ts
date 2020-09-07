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
        { source: 'decoratorClient', event: 'ready' },
        window.location.origin
      )
    }

    // Send ready message until decorator responds
    ;(function wait() {
      if (!ready) {
        setTimeout(wait, 50)
        sendAppReadyMessage()
      }
    })()

    const receiveMessage = (msg: MessageEvent) => {
      const { data } = msg
      const isSafe = msgSafetyCheck(msg)
      const { source, event } = data
      if (isSafe) {
        if (source === 'decorator' && event === 'ready') {
          ready = true
          window.removeEventListener('message', receiveMessage, false)
          resolve(true)
        }
      }
    }
    window.addEventListener('message', receiveMessage, false)
  })
}

export const msgSafetyCheck = (message: MessageEvent) => {
  const { origin, source } = message
  // Only allow messages from own window
  if (window.location.href.indexOf(origin) === 0 && source === window) {
    return true
  }
  return false
};
