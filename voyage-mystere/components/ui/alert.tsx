import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    success: {
      container: 'bg-success-50 border-success-200 text-success-900',
      icon: <CheckCircle className="w-5 h-5 text-success-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-900',
      icon: <AlertCircle className="w-5 h-5 text-warning-500" />,
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-900',
      icon: <XCircle className="w-5 h-5 text-error-500" />,
    },
  }

  const config = variants[variant]

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 flex items-start gap-3',
        config.container,
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-1 hover:bg-black hover:bg-opacity-5 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export { Alert }
