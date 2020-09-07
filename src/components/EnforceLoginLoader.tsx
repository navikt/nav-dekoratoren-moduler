import React, { useEffect, useState, Fragment } from 'react'
import NavFrontendSpinner from 'nav-frontend-spinner'
import { msgSafetyCheck } from '../functions/utils'

interface Props {
  authCallback?: (data: Auth) => void
  children: JSX.Element | JSX.Element[]
}

export type Auth = {
  authenticated: boolean
  securityLevel: '4' | '3'
  name: string
}

export type AuthFetch =
  | { status: 'LOADING' }
  | { status: 'RESULT'; payload: any }

const EnforceLoginLoader = ({ children, authCallback }: Props) => {
  const [authResult, setAuthResult] = useState<AuthFetch>({
    status: 'LOADING'
  })

  useEffect(() => {
    const receiveMessage = (msg: MessageEvent) => {
      const { data } = msg
      const isSafe = msgSafetyCheck(msg)
      const { source, event, payload } = data
      if (isSafe) {
        if (source === 'decorator' && event === 'auth') {
          if (authCallback) {
            authCallback(payload)
          }
          setAuthResult({ status: 'RESULT', payload })
        }
      }
    }
    window.addEventListener('message', receiveMessage, false)
    return () => {
      window.removeEventListener('message', receiveMessage, false)
    }
  }, [])

  switch (authResult.status) {
    default:
    case 'LOADING':
      return (
        <div style={styles.spinner}>
          <NavFrontendSpinner type='XL' />
        </div>
      )
    case 'RESULT':
      return <Fragment>{children}</Fragment>
  }
}

const styles = {
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '35rem',
    width: '100%'
  }
}

export default EnforceLoginLoader;
