'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  className?: string
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds)

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
      )
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)

        return (
          <div
            key={item.id}
            className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary-300"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className="font-semibold text-gray-900 pr-4">{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-primary-500 transition-transform duration-200 flex-shrink-0',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              id={`accordion-content-${item.id}`}
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { Accordion }
export type { AccordionItem }
