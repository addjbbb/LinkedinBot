import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
    warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
    error: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors duration-200 animate-fadeIn',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
