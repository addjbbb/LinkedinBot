'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Prevent hydration mismatch - only show after client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render placeholder during SSR to match client-side initial render
  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center gap-2 px-3 py-2 rounded-lg',
        'border-2 border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800',
        'hover:bg-gray-50 dark:hover:bg-gray-700',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            'absolute inset-0 w-5 h-5 text-amber-500',
            'transition-all duration-300',
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 w-5 h-5 text-blue-400',
            'transition-all duration-300',
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          )}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' ? 'Clair' : 'Sombre'}
        </span>
      )}
    </button>
  )
}
