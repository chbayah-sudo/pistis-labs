import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const { subject } = await params;
    const decodedSubject = decodeURIComponent(subject);

    // Use Pexels API for better, more relevant image search
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '563492ad6f91700001000001d7b7f0ad9b024773939d1a49b71e41b9';

    try {
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(decodedSubject)}&per_page=1&orientation=landscape`;
      const pexelsResponse = await fetch(pexelsUrl, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (pexelsResponse.ok) {
        const data = await pexelsResponse.json();
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          return NextResponse.json({
            url: photo.src.large2x || photo.src.large,
            width: photo.width,
            height: photo.height,
            alt: decodedSubject,
            source: 'pexels',
            photographer: photo.photographer
          });
        }
      }
    } catch (pexelsError) {
      console.log('Pexels API failed, trying Unsplash fallback...');
    }

    // Fallback to Unsplash with unique timestamp to avoid caching
    const timestamp = Date.now();
    const unsplashUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(decodedSubject)}&sig=${timestamp}`;

    const response = await fetch(unsplashUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'StoryWeave/1.0',
        'Cache-Control': 'no-cache'
      }
    });

    if (response.ok && response.url) {
      return NextResponse.json({
        url: response.url,
        width: 1600,
        height: 900,
        alt: decodedSubject,
        source: 'unsplash'
      });
    }

    // Final fallback - use a relevant generic image
    return NextResponse.json({
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop&q=80',
      width: 1200,
      height: 800,
      alt: decodedSubject,
      source: 'fallback'
    });

  } catch (error) {
    console.error('Error fetching image:', error);

    return NextResponse.json({
      url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=800&fit=crop&q=80',
      width: 1200,
      height: 800,
      alt: 'Image not available',
      source: 'error-fallback'
    }, { status: 200 });
  }
}
