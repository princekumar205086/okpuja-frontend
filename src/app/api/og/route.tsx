/**
 * OKPUJA - Dynamic OG Image Generator
 * API Route: /api/og
 * 
 * Generates dynamic Open Graph images for social sharing
 * Parameters: ?title=&city=&service=
 */

import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title') || 'Book Pandit Online | Puja & Astrology Services';
  const city = searchParams.get('city') || '';
  const service = searchParams.get('service') || '';

  // Build subtitle
  let subtitle = 'Trusted Puja & Astrology Services Across India';
  if (city && service) {
    subtitle = `${service} in ${city} | Verified Pandits`;
  } else if (city) {
    subtitle = `Puja Services in ${city} | Verified Pandits`;
  } else if (service) {
    subtitle = `${service} | Book Verified Pandit Online`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 30%, #FF4500 70%, #C41E3A 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background decorative pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            maxWidth: '1000px',
            textAlign: 'center',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '4px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            🙏 OKPUJA
          </div>

          {/* Divider */}
          <div
            style={{
              width: '120px',
              height: '4px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '2px',
              margin: '16px 0',
              display: 'flex',
            }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? '42px' : '52px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '16px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              display: 'flex',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            {subtitle}
          </div>

          {/* City badge */}
          {city && (
            <div
              style={{
                marginTop: '24px',
                padding: '8px 24px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                fontSize: '18px',
                color: '#FFFFFF',
                display: 'flex',
              }}
            >
              📍 {city}, India
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          okpuja.com | Book Verified Pandits Online
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
