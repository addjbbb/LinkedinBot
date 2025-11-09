'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'
import { Calendar, ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { Alert } from '@/components/ui/alert'

const themes = {
  romantique: { name: 'Romantique', emoji: '💕', color: 'pink' },
  nature: { name: 'Nature', emoji: '🌲', color: 'green' },
  urbain: { name: 'Urbain', emoji: '🏙️', color: 'blue' },
}

export default function DatesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const theme = searchParams.get('theme') as keyof typeof themes || 'romantique'

  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const themeInfo = themes[theme]

  const handleDateSelect = (date: Date) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Starting new selection
      setSelectedDates({ start: date, end: null })
    } else {
      // Completing selection
      if (date > selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: date })
      } else {
        setSelectedDates({ start: date, end: null })
      }
    }
  }

  const [isCreatingBooking, setIsCreatingBooking] = useState(false)

  const handleContinue = async () => {
    if (selectedDates.start && selectedDates.end) {
      setIsCreatingBooking(true)

      try {
        // Créer une réservation temporaire (draft)
        const response = await fetch('/api/bookings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            theme,
            startDate: selectedDates.start.toISOString().split('T')[0],
            endDate: selectedDates.end.toISOString().split('T')[0],
            status: 'draft', // Statut draft jusqu'au paiement
          }),
        })

        const data = await response.json()

        if (data.success && data.bookingId) {
          // Rediriger vers questionnaire avec booking_id
          const params = new URLSearchParams({
            booking_id: data.bookingId,
            theme,
          })
          router.push(`/reserver/questionnaire?${params.toString()}`)
        } else {
          alert('Erreur lors de la création de la réservation. Veuillez réessayer.')
        }
      } catch (error) {
        console.error('Error creating booking:', error)
        alert('Une erreur est survenue. Veuillez réessayer.')
      } finally {
        setIsCreatingBooking(false)
      }
    }
  }

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isDateInRange = (date: Date | null) => {
    if (!date || !selectedDates.start) return false
    if (!selectedDates.end) return date.getTime() === selectedDates.start.getTime()
    return date >= selectedDates.start && date <= selectedDates.end
  }

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            Choisissez vos dates
          </h1>
          <p className="text-lg text-gray-600">
            Voyage Mystère {themeInfo.emoji} {themeInfo.name}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex-1 h-2 bg-primary-500 rounded-full" />
          <div className="flex-1 h-2 bg-gray-200 rounded-full" />
          <div className="flex-1 h-2 bg-gray-200 rounded-full" />
          <div className="flex-1 h-2 bg-gray-200 rounded-full" />
          <div className="flex-1 h-2 bg-gray-200 rounded-full" />
        </div>

        {/* Info Alert */}
        <Alert variant="info" className="mb-8">
          <Info className="w-5 h-5" />
          <div>
            <strong>Bon à savoir :</strong> Nous recommandons de réserver au minimum 30 jours à l'avance pour profiter de toutes les disponibilités. Les week-ends sont proposés du vendredi au dimanche (2 nuits).
          </div>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold capitalize">{monthName}</h3>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Week days */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    const inRange = isDateInRange(date)
                    const disabled = isDateDisabled(date)
                    const isStart = date && selectedDates.start && date.getTime() === selectedDates.start.getTime()
                    const isEnd = date && selectedDates.end && date.getTime() === selectedDates.end.getTime()

                    return (
                      <button
                        key={index}
                        onClick={() => date && !disabled && handleDateSelect(date)}
                        disabled={!date || disabled}
                        className={`
                          aspect-square p-2 rounded-lg text-sm font-medium transition-all
                          ${!date ? 'invisible' : ''}
                          ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary-50'}
                          ${inRange && !disabled ? 'bg-primary-100 text-primary-900' : ''}
                          ${(isStart || isEnd) && !disabled ? 'bg-primary-500 text-white' : ''}
                          ${!inRange && !disabled ? 'text-gray-700' : ''}
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardBody className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Votre sélection</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Arrivée</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedDates.start
                        ? selectedDates.start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                        : 'Non sélectionnée'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Départ</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedDates.end
                        ? selectedDates.end.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                        : 'Non sélectionnée'}
                    </div>
                  </div>

                  {selectedDates.start && selectedDates.end && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-600 mb-1">Durée</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24))} nuits
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedDates.start || !selectedDates.end}
                  isLoading={isCreatingBooking}
                >
                  {isCreatingBooking ? 'Création...' : (
                    <>
                      Continuer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Les disponibilités exactes seront vérifiées à l'étape suivante
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
