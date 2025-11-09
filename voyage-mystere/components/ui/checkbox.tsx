import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex flex-col">
        <div className="flex items-start">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={cn(
                'peer w-5 h-5 rounded border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'checked:bg-primary-500 checked:border-primary-500',
                'cursor-pointer appearance-none',
                error ? 'border-error-500' : 'border-gray-300',
                className
              )}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${checkboxId}-error` : undefined}
              {...props}
            />
            <Check className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity left-0.5 top-0.5" />
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-3 text-sm text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={`${checkboxId}-error`} className="mt-2 text-sm text-error-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={cn(
            'w-5 h-5 border-2 border-gray-300 rounded-full transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'checked:border-primary-500 checked:border-[6px]',
            'cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className="ml-3 text-sm text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export { Checkbox, Radio }
