let ready = false

export const isReady = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== `undefined`) {
      reject(Error('Missing window, can only be used client-side'))
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
          window.removeEventListener('message', receiveMessage)
          resolve(true)
        }
      }
    }
    window.addEventListener('message', receiveMessage)
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
