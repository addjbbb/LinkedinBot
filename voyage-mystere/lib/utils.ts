import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price in euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format date in French
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

/**
 * Format date range
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate

  const startFormatted = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
  }).format(start)

  const endFormatted = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(end)

  return `${startFormatted} → ${endFormatted}`
}

/**
 * Scroll to element
 */
export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate booking number
 */
export function generateBookingNumber(): string {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `VM-${year}-${month}-${random}`
}

/**
 * Calculate days until date
 */
export function daysUntil(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate > new Date()
}

/**
 * Get theme color
 */
export function getThemeColor(theme: 'romantique' | 'nature' | 'urbain'): string {
  const colors = {
    romantique: 'bg-pink-100 text-pink-700 border-pink-300',
    nature: 'bg-green-100 text-green-700 border-green-300',
    urbain: 'bg-blue-100 text-blue-700 border-blue-300',
  }
  return colors[theme]
}

/**
 * Get theme emoji
 */
export function getThemeEmoji(theme: 'romantique' | 'nature' | 'urbain'): string {
  const emojis = {
    romantique: '💕',
    nature: '🌲',
    urbain: '🏙️',
  }
  return emojis[theme]
}
