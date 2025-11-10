'use client'

import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface Step {
  num: number
  title: string
  completed?: boolean
}

interface ProgressBarProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function ProgressBar({ steps, currentStep, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = step.completed || step.num < currentStep
          const isCurrent = step.num === currentStep
          const isLast = idx === steps.length - 1

          return (
            <div key={step.num} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    isCompleted &&
                      'bg-green-500 text-white scale-110 animate-scale-in',
                    isCurrent &&
                      'bg-primary-500 text-white scale-110 ring-4 ring-primary-200 dark:ring-primary-800 animate-pulse-slow',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 animate-scale-in" />
                  ) : (
                    step.num
                  )}
                </div>
                <div
                  className={cn(
                    'mt-2 text-xs sm:text-sm font-medium text-center transition-colors duration-200',
                    isCurrent && 'text-primary-700 dark:text-primary-400 font-semibold',
                    isCompleted && 'text-green-600 dark:text-green-400',
                    !isCurrent &&
                      !isCompleted &&
                      'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {step.title}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-2 relative">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full transition-all duration-500',
                      isCompleted
                        ? 'bg-green-500 w-full'
                        : isCurrent
                        ? 'bg-primary-500 w-1/2 animate-pulse'
                        : 'bg-transparent w-0'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
