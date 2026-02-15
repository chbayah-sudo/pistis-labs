import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const { subject } = await params;
    const decodedSubject = decodeURIComponent(subject);
    
    // Use Unsplash's source endpoint to get a random relevant image
    // This searches for images matching the subject and returns a redirect to a specific image
    const unsplashSourceUrl = `https://source.unsplash.com/1200x800/?${encodeURIComponent(decodedSubject)}`;
    
    // Fetch with redirect: 'follow' to get the final image URL
    const response = await fetch(unsplashSourceUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'StoryWeave/1.0'
      }
    });

    if (response.ok) {
      // Get the final URL after following redirects
      const finalUrl = response.url;
      
      return NextResponse.json({
        url: finalUrl,
        width: 1200,
        height: 800,
        alt: decodedSubject,
        source: 'unsplash'
      });
    }

    // Fallback: return a generic image
    return NextResponse.json({
      url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=800&fit=crop&q=80',
      width: 1200,
      height: 800,
      alt: decodedSubject,
      source: 'fallback'
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    
    // Return a safe fallback on error
    return NextResponse.json({
      url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=800&fit=crop&q=80',
      width: 1200,
      height: 800,
      alt: 'Image not available',
      source: 'error-fallback'
    }, { status: 200 });
  }
}
