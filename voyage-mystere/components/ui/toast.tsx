'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration: number = 5000) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = { id, message, variant, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, duration)
      }
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const variants = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-900',
      icon: <CheckCircle className="w-5 h-5 text-success-500" />,
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-900',
      icon: <XCircle className="w-5 h-5 text-error-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-900',
      icon: <AlertCircle className="w-5 h-5 text-warning-500" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => {
          const config = variants[toast.variant]
          return (
            <div
              key={toast.id}
              className={cn(
                'rounded-lg border-2 p-4 shadow-lg flex items-center gap-3 animate-slideInRight',
                config.container
              )}
            >
              {config.icon}
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-black hover:bg-opacity-10 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
