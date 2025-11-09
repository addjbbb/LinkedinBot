// Sentry error monitoring integration
// Run: npm install @sentry/nextjs

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || ''

interface SentryConfig {
  dsn: string
  environment: string
  tracesSampleRate: number
  replaysSessionSampleRate: number
  replaysOnErrorSampleRate: number
}

export const sentryConfig: SentryConfig = {
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
}

// Initialize Sentry (call this in _app.tsx or layout.tsx)
export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured')
    return
  }

  // This will be replaced with actual Sentry.init after npm install
  console.log('Sentry configuration ready. Install @sentry/nextjs to activate.')
}

// Manual error capture
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', error, context)
  }

  // This will use Sentry.captureException after installation
  // Sentry.captureException(error, { extra: context })
}

// Manual message capture
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message)
  }

  // This will use Sentry.captureMessage after installation
  // Sentry.captureMessage(message, level)
}

// Set user context
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  // This will use Sentry.setUser after installation
  // Sentry.setUser(user)
  console.log('User context set:', user.id)
}

// Clear user context (on logout)
export const clearUser = () => {
  // This will use Sentry.setUser(null) after installation
  // Sentry.setUser(null)
  console.log('User context cleared')
}

// Add breadcrumb (for debugging context)
export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  // This will use Sentry.addBreadcrumb after installation
  // Sentry.addBreadcrumb({
  //   message,
  //   category,
  //   data,
  //   level: 'info',
  // })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Breadcrumb] ${category}: ${message}`, data)
  }
}

// Wrap async functions to capture errors
export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  fallback?: (error: Error) => any
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args)

      if (result instanceof Promise) {
        return result.catch((error) => {
          captureException(error, { function: fn.name, args })
          if (fallback) return fallback(error)
          throw error
        })
      }

      return result
    } catch (error) {
      captureException(error as Error, { function: fn.name, args })
      if (fallback) return fallback(error as Error)
      throw error
    }
  }) as T
}

// Performance monitoring
export const startTransaction = (name: string, op: string) => {
  // This will use Sentry.startTransaction after installation
  const start = Date.now()

  return {
    finish: () => {
      const duration = Date.now() - start
      console.log(`[Performance] ${op}:${name} took ${duration}ms`)
      // Sentry transaction.finish()
    },
  }
}

/*
 * INSTALLATION INSTRUCTIONS:
 *
 * 1. Install Sentry:
 *    npm install @sentry/nextjs
 *
 * 2. Run Sentry wizard:
 *    npx @sentry/wizard@latest -i nextjs
 *
 * 3. Add to .env.local:
 *    NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
 *    SENTRY_AUTH_TOKEN=your-auth-token
 *
 * 4. The wizard will create:
 *    - sentry.client.config.ts
 *    - sentry.server.config.ts
 *    - sentry.edge.config.ts
 *
 * 5. Uncomment Sentry calls in this file
 */
