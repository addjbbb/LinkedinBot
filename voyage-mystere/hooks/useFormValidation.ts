import { useState, useEffect, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean | string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  custom?: (value: any) => string | undefined
  asyncCheck?: (value: any) => Promise<string | undefined>
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule
}

export interface FieldError {
  message: string
  type: 'error' | 'warning' | 'success'
}

export interface ValidationErrors {
  [fieldName: string]: FieldError | undefined
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({})

  const validateField = useCallback(
    async (fieldName: string, value: any): Promise<FieldError | undefined> => {
      const rule = rules[fieldName]
      if (!rule) return undefined

      // Required check
      if (rule.required) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          const message =
            typeof rule.required === 'string'
              ? rule.required
              : 'Ce champ est requis'
          return { message, type: 'error' }
        }
      }

      // If empty and not required, no other validation needed
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return undefined
      }

      // Min length check
      if (rule.minLength && value.length < rule.minLength.value) {
        return { message: rule.minLength.message, type: 'error' }
      }

      // Max length check
      if (rule.maxLength && value.length > rule.maxLength.value) {
        return { message: rule.maxLength.message, type: 'error' }
      }

      // Pattern check
      if (rule.pattern && !rule.pattern.value.test(value)) {
        return { message: rule.pattern.message, type: 'error' }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) {
          return { message: customError, type: 'error' }
        }
      }

      // Async validation (e.g., check email availability)
      if (rule.asyncCheck) {
        setIsValidating((prev) => ({ ...prev, [fieldName]: true }))
        try {
          const asyncError = await rule.asyncCheck(value)
          if (asyncError) {
            return { message: asyncError, type: 'error' }
          }
        } finally {
          setIsValidating((prev) => ({ ...prev, [fieldName]: false }))
        }
      }

      // If all validations pass, show success
      if (touched[fieldName]) {
        return { message: 'Valide ✓', type: 'success' }
      }

      return undefined
    },
    [rules, touched]
  )

  const handleChange = useCallback(
    async (fieldName: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }))

      // Mark as touched on change
      setTouched((prev) => ({ ...prev, [fieldName as string]: true }))

      // Validate immediately if field was already touched
      if (touched[fieldName as string]) {
        const error = await validateField(fieldName as string, value)
        setErrors((prev) => ({ ...prev, [fieldName as string]: error }))
      }
    },
    [touched, validateField]
  )

  const handleBlur = useCallback(
    async (fieldName: keyof T) => {
      setTouched((prev) => ({ ...prev, [fieldName as string]: true }))
      const value = values[fieldName]
      const error = await validateField(fieldName as string, value)
      setErrors((prev) => ({ ...prev, [fieldName as string]: error }))
    },
    [values, validateField]
  )

  const validateAll = useCallback(async (): Promise<boolean> => {
    const newErrors: ValidationErrors = {}
    const fieldNames = Object.keys(rules)

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    fieldNames.forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    // Validate all fields
    for (const fieldName of fieldNames) {
      const error = await validateField(fieldName, values[fieldName])
      if (error && error.type === 'error') {
        newErrors[fieldName] = error
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [rules, values, validateField])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsValidating({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isValidating,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
  }
}

// Helper to get input props for a field
export function getFieldProps<T>(
  fieldName: keyof T,
  validation: ReturnType<typeof useFormValidation<T>>
) {
  return {
    value: validation.values[fieldName],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      validation.handleChange(fieldName, e.target.value),
    onBlur: () => validation.handleBlur(fieldName),
    error: validation.errors[fieldName as string],
    isValidating: validation.isValidating[fieldName as string],
  }
}
