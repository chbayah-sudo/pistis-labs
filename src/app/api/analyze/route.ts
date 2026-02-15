import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Determine media type
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';
    if (file.type === 'image/png') mediaType = 'image/png';
    else if (file.type === 'image/gif') mediaType = 'image/gif';
    else if (file.type === 'image/webp') mediaType = 'image/webp';

    // First, analyze the image to understand what it is
    const analysisResponse = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analyze this image and identify what is shown. This could be anything - an object, a place, a person, a historical moment, a living thing, a concept, etc. Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "subject": "what is shown in the image",
  "type": "object | place | person | historical_moment | living_thing | concept | other",
  "description": "2-3 sentence description"
}`,
            },
          ],
        },
      ],
    });

    let subjectInfo;
    try {
      const analysisText = analysisResponse.content[0].type === 'text' 
        ? analysisResponse.content[0].text 
        : '';
      subjectInfo = JSON.parse(analysisText);
    } catch {
      subjectInfo = {
        subject: 'Unknown Subject',
        type: 'other',
        description: 'A subject with a fascinating story to discover',
      };
    }

    // Generate the story narrative for whatever is in the image
    const journeyResponse = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: `You are a brilliant storyteller. Create a compelling, cinematic narrative about: "${subjectInfo.subject}" (Type: ${subjectInfo.type}).

Your narrative should reveal the STORY behind this subject. Depending on the type:
- For PRODUCTS: trace its production journey from origin to consumer
- For PLACES: tell its geographic, cultural, or historical evolution
- For HISTORICAL MOMENTS: provide context, causes, and consequences
- For LIVING THINGS: explain its evolution, biology, and place in nature
- For PERSONS: biographical narrative and impact
- For CONCEPTS: explain origins, development, and significance
- For OTHER: create the most compelling narrative you can

Create a JSON response with this exact structure (VALID JSON only, no markdown):
{
  "title": "${subjectInfo.subject}",
  "narrative": "A 3-4 paragraph cinematic narrative that draws readers into the story",
  "stops": [
    {
      "id": "stop1",
      "title": "Chapter/Stage 1 Title",
      "description": "Brief step description",
      "location": {
        "name": "Location/Context (can be physical place or time period)",
        "lat": 0.0,
        "lng": 0.0
      },
      "story": "Detailed, vivid story of this chapter explaining what happened and why it matters",
      "personName": "Key figure/entity involved",
      "personQuote": "A meaningful quote or insight related to this stage",
      "economicImpact": "Impact or significance of this stage",
      "duration": "Time period or duration"
    }
  ],
  "startLocation": {
    "name": "Beginning point (origin, big bang, birth, founding, etc.)",
    "lat": 0.0,
    "lng": 0.0
  },
  "endLocation": {
    "name": "Current state or destination",
    "lat": 0.0,
    "lng": 0.0
  }
}

Make it DRAMATIC, HUMAN, and EMOTIONALLY RESONANT. Use realistic coordinates when possible. Create 4-5 chapters that tell a cohesive story. Be specific with dates, names, and details. This should be something that makes people say "Wow, I never knew that!"`,
        },
      ],
    });

    let journeyData;
    try {
      const journeyText = journeyResponse.content[0].type === 'text'
        ? journeyResponse.content[0].text
        : '';
      journeyData = JSON.parse(journeyText);
    } catch {
      journeyData = {
        title: subjectInfo.subject,
        narrative: 'A story waiting to be discovered.',
        stops: [],
        startLocation: { name: 'Origin', lat: 0, lng: 0 },
        endLocation: { name: 'Today', lat: 0, lng: 0 },
      };
    }

    // Fetch the image for this subject
    let imageUrl = '';
    try {
      const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/image/${encodeURIComponent(subjectInfo.subject)}`);
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.url || '';
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }

    // Build the final response
    const journey = {
      product: journeyData.title || subjectInfo.subject,
      productCategory: subjectInfo.type,
      description: subjectInfo.description,
      imageUrl: imageUrl || `/api/image/${encodeURIComponent(subjectInfo.subject)}`,
      narrative: journeyData.narrative,
      stops: journeyData.stops.map((stop: any) => ({
        id: stop.id,
        title: stop.title,
        description: stop.description,
        location: stop.location,
        story: stop.story,
        personName: stop.personName,
        personQuote: stop.personQuote,
        economicImpact: stop.economicImpact,
        duration: stop.duration,
        imageUrl: undefined,
      })),
      map: {
        startLocation: journeyData.startLocation,
        endLocation: journeyData.endLocation,
      },
      totalDistance: `${journeyData.stops?.length * 1000} km (estimated)`,
      musicUrl: undefined,
    };

    return NextResponse.json(journey);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
