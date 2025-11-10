import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  isLoading?: boolean
  loading?: boolean // Alias pour compatibilité
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, loading, disabled, ...props }, ref) => {
    const isButtonLoading = isLoading || loading
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95'

    const variants = {
      primary: 'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700 text-white shadow-md hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-accent-500',
      secondary: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 border-2 border-primary-500 dark:border-primary-400 hover:border-primary-600 dark:hover:border-primary-300 focus:ring-primary-500',
      ghost: 'bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:ring-primary-500',
      outline: 'bg-transparent dark:bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:ring-gray-500',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isButtonLoading && 'opacity-70 cursor-wait',
          className
        )}
        disabled={disabled || isButtonLoading}
        {...props}
      >
        {isButtonLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Chargement...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
