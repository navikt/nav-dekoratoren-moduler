import React, { useEffect, useState, Fragment } from 'react'
import NavFrontendSpinner from 'nav-frontend-spinner'
import styles from './styles.module.css'

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

export const EnforceLoginLoader = ({ children, authCallback }: Props) => {
  const [authResult, setAuthResult] = useState<AuthFetch>({
    status: 'LOADING'
  })

  useEffect(() => {
    const receiveMessage = ({ data }: MessageEvent) => {
      const { source, event, payload } = data
      if (source === 'decorator' && event === 'auth') {
        if (authCallback) {
          authCallback(payload)
        }
        setAuthResult({ status: 'RESULT', payload })
      }
    }
    window.addEventListener('message', receiveMessage, false)
    return () => {
      window.removeEventListener('message', receiveMessage, false)
    }
  })

  switch (authResult.status) {
    default:
    case 'LOADING':
      return <div className={styles.loader}><NavFrontendSpinner type='XL' /></div>
    case 'RESULT':
      return <Fragment>{children}</Fragment>
  }
}
