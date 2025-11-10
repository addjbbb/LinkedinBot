'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  left: string
  animationDelay: string
  backgroundColor: string
}

export function Confetti({ show, duration = 3000 }: { show: boolean; duration?: number }) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (show) {
      // Generate 50 confetti pieces
      const pieces: ConfettiPiece[] = []
      const colors = [
        '#3B82F6', // primary-500
        '#EC4899', // accent-500
        '#F97316', // secondary-500
        '#22C55E', // success-500
        '#F59E0B', // warning-500
        '#FBCFE8', // accent-200
        '#BFDBFE', // primary-200
        '#FED7AA', // secondary-200
      ]

      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      setConfettiPieces(pieces)

      // Clear confetti after duration
      const timeout = setTimeout(() => {
        setConfettiPieces([])
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [show, duration])

  if (confettiPieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 w-3 h-3 opacity-80"
          style={{
            left: piece.left,
            backgroundColor: piece.backgroundColor,
            animationDelay: piece.animationDelay,
            animation: 'confettiFall 3s ease-out forwards',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
