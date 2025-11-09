'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  placeholder?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  placeholder = 'blur',
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Placeholder image from Unsplash
  const fallbackSrc = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width || 800}&h=${height || 600}&fit=crop&auto=format`

  const handleError = () => {
    console.error(`Error loading image: ${src}`)
    setHasError(true)
    setImgSrc(fallbackSrc)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative ${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`object-${objectFit} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  )
}

// Pre-defined placeholder images for common use cases
export const PLACEHOLDER_IMAGES = {
  romantic: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&h=800&fit=crop',
  nature: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
  urban: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&h=800&fit=crop',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
  food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
  adventure: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&h=800&fit=crop',
  couple: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=800&fit=crop',
  landscape: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
  og_default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=630&fit=crop',
}
