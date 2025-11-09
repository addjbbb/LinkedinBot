'use client'

import { useEffect } from 'react'

interface TrustpilotWidgetProps {
  templateId?: string
  businessUnitId?: string
  height?: string
  width?: string
  theme?: 'light' | 'dark'
  stars?: string
  locale?: string
}

export function TrustpilotWidget({
  templateId = '5419b6a8b0d04a076446a9ad', // Default: Mini widget
  businessUnitId = 'YOUR_BUSINESS_UNIT_ID', // À remplacer avec votre ID Trustpilot
  height = '24px',
  width = '100%',
  theme = 'light',
  stars = '4,5',
  locale = 'fr-FR',
}: TrustpilotWidgetProps) {
  useEffect(() => {
    // Load Trustpilot widget script
    if (typeof window !== 'undefined' && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(
        document.getElementById('trustpilot-widget'),
        true
      )
    }
  }, [])

  return (
    <>
      {/* Trustpilot Widget */}
      <div
        id="trustpilot-widget"
        className="trustpilot-widget"
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={businessUnitId}
        data-style-height={height}
        data-style-width={width}
        data-theme={theme}
        data-stars={stars}
      >
        <a
          href={`https://fr.trustpilot.com/review/voyage-mystere.fr`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-primary-600"
        >
          Trustpilot
        </a>
      </div>

      {/* Load Trustpilot script */}
      <script
        type="text/javascript"
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        async
      />
    </>
  )
}

// Predefined widget types
export function TrustpilotMiniWidget() {
  return (
    <TrustpilotWidget
      templateId="5419b6a8b0d04a076446a9ad"
      height="24px"
    />
  )
}

export function TrustpilotCarouselWidget() {
  return (
    <TrustpilotWidget
      templateId="539adbd6dec7e10e686debee"
      height="350px"
    />
  )
}

export function TrustpilotMicroReviewCountWidget() {
  return (
    <TrustpilotWidget
      templateId="5419b6ffb0d04a076446a9af"
      height="24px"
    />
  )
}

/*
 * SETUP INSTRUCTIONS:
 *
 * 1. Create Trustpilot account:
 *    https://fr.business.trustpilot.com/
 *
 * 2. Verify your business domain
 *
 * 3. Get your Business Unit ID:
 *    Settings → Widget → Copy Business Unit ID
 *
 * 4. Replace 'YOUR_BUSINESS_UNIT_ID' above with your actual ID
 *
 * 5. Choose widget template:
 *    - Mini: 5419b6a8b0d04a076446a9ad
 *    - Carousel: 539adbd6dec7e10e686debee
 *    - Micro Review Count: 5419b6ffb0d04a076446a9af
 *    - More: https://support.trustpilot.com/hc/en-us/articles/115011421468
 *
 * 6. Add widget to your page:
 *    <TrustpilotMiniWidget />
 */
