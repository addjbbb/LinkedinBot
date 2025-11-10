import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)}
      {...props}
    />
  )
}

// Card skeleton for bookings
export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="mt-4 md:mt-0">
          <Skeleton className="h-8 w-24 ml-auto" />
          <Skeleton className="h-4 w-32 mt-1 ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Skeleton className="w-5 h-5 mr-3" />
          <div className="flex-1">
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="flex items-center">
          <Skeleton className="w-5 h-5 mr-3" />
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  )
}

// Profile card skeleton
export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6">
      <div className="text-center mb-6">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
        <Skeleton className="h-5 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
        <Skeleton className="h-6 w-28 mx-auto mt-2 rounded-full" />
      </div>

      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6 text-center">
      <Skeleton className="w-8 h-8 mx-auto mb-2" />
      <Skeleton className="h-8 w-16 mx-auto mb-1" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  )
}

// Form input skeleton
export function InputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}

// Theme card skeleton for selection
export function ThemeCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-white">
      <Skeleton className="h-64 w-full" />
      <div className="p-6">
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

// Calendar skeleton
export function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
