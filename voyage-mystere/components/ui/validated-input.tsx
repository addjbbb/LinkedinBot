import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, Loader2, AlertTriangle } from 'lucide-react'
import { FieldError } from '@/hooks/useFormValidation'

export interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError
  helperText?: string
  isValidating?: boolean
  showValidationIcon?: boolean
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      isValidating,
      showValidationIcon = true,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`

    const getValidationIcon = () => {
      if (!showValidationIcon) return null
      if (isValidating) {
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      }
      if (error) {
        switch (error.type) {
          case 'error':
            return <AlertCircle className="w-5 h-5 text-error-500" />
          case 'warning':
            return <AlertTriangle className="w-5 h-5 text-amber-500" />
          case 'success':
            return <CheckCircle2 className="w-5 h-5 text-green-500" />
        }
      }
      return null
    }

    const getBorderColor = () => {
      if (error) {
        switch (error.type) {
          case 'error':
            return 'border-error-500 focus:ring-error-500 focus:border-error-500'
          case 'warning':
            return 'border-amber-500 focus:ring-amber-500 focus:border-amber-500'
          case 'success':
            return 'border-green-500 focus:ring-green-500 focus:border-green-500'
        }
      }
      return 'border-gray-300 hover:border-gray-400 focus:ring-primary-500 focus:border-primary-500'
    }

    const getMessageColor = () => {
      if (error) {
        switch (error.type) {
          case 'error':
            return 'text-error-600'
          case 'warning':
            return 'text-amber-600'
          case 'success':
            return 'text-green-600'
        }
      }
      return 'text-gray-500'
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
              showValidationIcon && (isValidating || error) ? 'pr-12' : '',
              getBorderColor(),
              className
            )}
            aria-invalid={error?.type === 'error' ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />
          {(isValidating || error) && showValidationIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getValidationIcon()}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className={cn('mt-2 text-sm font-medium flex items-center gap-1', getMessageColor())}
          >
            {error.message}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'

export interface ValidatedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: FieldError
  helperText?: string
  isValidating?: boolean
  showValidationIcon?: boolean
  showCharCount?: boolean
}

const ValidatedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  ValidatedTextareaProps
>(
  (
    {
      className,
      label,
      error,
      helperText,
      isValidating,
      showValidationIcon = true,
      showCharCount = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = id || `textarea-${generatedId}`
    const currentLength = String(value || '').length

    const getValidationIcon = () => {
      if (!showValidationIcon) return null
      if (isValidating) {
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      }
      if (error) {
        switch (error.type) {
          case 'error':
            return <AlertCircle className="w-5 h-5 text-error-500" />
          case 'warning':
            return <AlertTriangle className="w-5 h-5 text-amber-500" />
          case 'success':
            return <CheckCircle2 className="w-5 h-5 text-green-500" />
        }
      }
      return null
    }

    const getBorderColor = () => {
      if (error) {
        switch (error.type) {
          case 'error':
            return 'border-error-500 focus:ring-error-500 focus:border-error-500'
          case 'warning':
            return 'border-amber-500 focus:ring-amber-500 focus:border-amber-500'
          case 'success':
            return 'border-green-500 focus:ring-green-500 focus:border-green-500'
        }
      }
      return 'border-gray-300 hover:border-gray-400 focus:ring-primary-500 focus:border-primary-500'
    }

    const getMessageColor = () => {
      if (error) {
        switch (error.type) {
          case 'error':
            return 'text-error-600'
          case 'warning':
            return 'text-amber-600'
          case 'success':
            return 'text-green-600'
        }
      }
      return 'text-gray-500'
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={cn(
              'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
              'resize-vertical min-h-[120px]',
              showValidationIcon && (isValidating || error) ? 'pr-12' : '',
              getBorderColor(),
              className
            )}
            aria-invalid={error?.type === 'error' ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : helperText
                ? `${textareaId}-helper`
                : undefined
            }
            {...props}
          />
          {(isValidating || error) && showValidationIcon && (
            <div className="absolute right-3 top-3">{getValidationIcon()}</div>
          )}
        </div>
        <div className="flex justify-between items-start mt-2">
          <div className="flex-1">
            {error && (
              <p
                id={`${textareaId}-error`}
                className={cn('text-sm font-medium flex items-center gap-1', getMessageColor())}
              >
                {error.message}
              </p>
            )}
            {helperText && !error && (
              <p
                id={`${textareaId}-helper`}
                className="text-sm text-gray-500"
              >
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p
              className={cn(
                'text-sm',
                currentLength > maxLength * 0.9
                  ? 'text-amber-600 font-medium'
                  : 'text-gray-500'
              )}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

ValidatedTextarea.displayName = 'ValidatedTextarea'

export { ValidatedInput, ValidatedTextarea }
