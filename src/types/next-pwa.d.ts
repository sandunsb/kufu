declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  interface PWAConfig {
    dest?: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    // whatever other keys you pass
  }

  function withPWA(config: PWAConfig & NextConfig): NextConfig
  export = withPWA
}