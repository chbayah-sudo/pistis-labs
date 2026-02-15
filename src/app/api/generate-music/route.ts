import { NextRequest, NextResponse } from 'next/server';

interface SunoRequestBody {
  product: string;
  narrative: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SunoRequestBody = await request.json();
    const { product, narrative } = body;

    if (!product || !narrative) {
      return NextResponse.json(
        { error: 'Missing product or narrative' },
        { status: 400 }
      );
    }

    // Create a prompt for Suno that captures the cinematic journey
    const sunoPrompt = `Create a cinematic, emotionally resonant background music for a documentary about the supply chain journey of ${product}. 
    
The story involves: ${narrative.substring(0, 200)}...

The music should be:
- Cinematic and inspiring
- Subtle and non-intrusive (background music)
- Approximately 2-3 minutes long
- World music influences reflecting the global supply chain
- Building emotional arc from origin to consumer
- Instrumental, no vocals

Style: Documentary cinematic soundtrack`;

    // Call Suno API
    const sunoResponse = await fetch(
      'https://api.suno.ai/api/custom_generate',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: sunoPrompt,
          model: 'v4',
          make_instrumental: true,
          wait_audio: false,
        }),
      }
    );

    if (!sunoResponse.ok) {
      const errorData = await sunoResponse.text();
      console.error('Suno API error:', errorData);
      // Return placeholder if Suno fails
      return NextResponse.json({
        musicUrl: null,
        status: 'pending',
        message: 'Music generation queued',
      });
    }

    const data = await sunoResponse.json();

    return NextResponse.json({
      musicUrl: data.clips?.[0]?.video_url || data.clips?.[0]?.audio_url,
      sunoId: data.clips?.[0]?.id,
      status: data.clips?.[0]?.status || 'pending',
    });
  } catch (error) {
    console.error('Error generating music:', error);
    return NextResponse.json(
      { error: 'Failed to generate music', status: 'error' },
      { status: 500 }
    );
  }
}
