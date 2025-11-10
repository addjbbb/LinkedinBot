/**
 * Environment Variables Validation
 * Validates all required environment variables at startup
 */

interface EnvVars {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string

  // Resend (Email)
  RESEND_API_KEY: string

  // App
  NEXT_PUBLIC_BASE_URL: string
}

const requiredEnvVars: (keyof EnvVars)[] = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_BASE_URL',
]

/**
 * Validates that all required environment variables are present
 * Throws an error with details about missing variables
 */
export function validateEnv(): void {
  const missing: string[] = []
  const invalid: { key: string; reason: string }[] = []

  for (const key of requiredEnvVars) {
    const value = process.env[key]

    if (!value || value.trim() === '') {
      missing.push(key)
      continue
    }

    // Additional validation for specific keys
    switch (key) {
      case 'NEXT_PUBLIC_SUPABASE_URL':
        if (!value.startsWith('http')) {
          invalid.push({ key, reason: 'Must be a valid URL starting with http/https' })
        }
        break

      case 'NEXT_PUBLIC_BASE_URL':
        if (!value.startsWith('http')) {
          invalid.push({ key, reason: 'Must be a valid URL starting with http/https' })
        }
        break

      case 'SUPABASE_SERVICE_ROLE_KEY':
        if (value.length < 100) {
          invalid.push({ key, reason: 'Service role key seems too short (should be ~200+ chars)' })
        }
        break

      case 'STRIPE_SECRET_KEY':
        if (!value.startsWith('sk_')) {
          invalid.push({ key, reason: 'Must start with sk_' })
        }
        break

      case 'STRIPE_WEBHOOK_SECRET':
        if (!value.startsWith('whsec_')) {
          invalid.push({ key, reason: 'Must start with whsec_' })
        }
        break
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    let errorMessage = '❌ ENVIRONMENT VALIDATION FAILED\n\n'

    if (missing.length > 0) {
      errorMessage += '🚫 Missing required environment variables:\n'
      missing.forEach(key => {
        errorMessage += `   - ${key}\n`
      })
      errorMessage += '\n'
    }

    if (invalid.length > 0) {
      errorMessage += '⚠️  Invalid environment variables:\n'
      invalid.forEach(({ key, reason }) => {
        errorMessage += `   - ${key}: ${reason}\n`
      })
      errorMessage += '\n'
    }

    errorMessage += '📝 Please check your .env.local file and ensure all required variables are set.\n'
    errorMessage += '📖 See .env.example for reference.\n'

    throw new Error(errorMessage)
  }

  console.log('✅ Environment variables validated successfully')
}

/**
 * Gets a required environment variable
 * Throws an error if not found
 */
export function getEnv(key: keyof EnvVars): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

// Validate on module load (only on server)
if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    console.error(error)
    // In development, throw error to stop the app
    if (process.env.NODE_ENV === 'development') {
      throw error
    }
  }
}
