import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== Image Analysis Request Started ===');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    console.log(`Image converted to base64, length: ${base64.length} characters`);

    // Determine media type
    const mediaType = file.type || 'image/jpeg';
    console.log(`Media type: ${mediaType}`);

    console.log('Sending request to Claude Haiku...');
    // Using Haiku for faster responses
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analyze this image and create a RICH, DETAILED, COMPELLING story about what you see. Focus on the MAIN SUBJECT (product, brand, or item), not background details.

BE VERBOSE AND DETAILED. Write like a documentary filmmaker telling an epic story.

Respond with ONLY valid JSON (no markdown, no code blocks):

{
  "subject": "main product/brand name ONLY (e.g., 'Starbucks Coffee', 'iPhone', 'Nike Shoes') - NOT 'coffee cup' or 'phone case'",
  "type": "object|place|person|historical_moment|living_thing|concept|other",
  "description": "3-4 vivid sentences painting a picture of the main subject and its significance in the world today",
  "narrative": "4-6 compelling sentences about the overall journey and story behind this subject - be dramatic and engaging",
  "stops": [
    {
      "id": "stop1",
      "title": "evocative chapter title (3-5 words)",
      "description": "2-3 sentences setting the scene for this chapter",
      "location": {"name": "specific location name", "lat": 0.0, "lng": 0.0},
      "story": "3-4 detailed paragraphs (8-12 sentences total) telling this chapter's story with rich details, emotions, struggles, and triumphs. Include specific events, dates when possible, and vivid descriptions.",
      "personName": "full name of key historical figure or pioneer",
      "personQuote": "meaningful, impactful quote that captures the essence of this moment",
      "economicImpact": "2-3 sentences about the economic, cultural, or societal significance of this chapter",
      "duration": "specific time period or era (e.g., '1850-1875' or 'The Industrial Revolution')"
    }
  ],
  "startLocation": {"name": "origin", "lat": 0.0, "lng": 0.0},
  "endLocation": {"name": "destination", "lat": 0.0, "lng": 0.0}
}

CRITICAL REQUIREMENTS:
- Create exactly 4 dramatic chapters with RICH, DETAILED content
- Each stop's "story" field should be 8-12 sentences (3-4 paragraphs worth of content)
- Use realistic GPS coordinates with decimal precision
- Be SPECIFIC with names, dates, locations, and events
- Be EMOTIONAL and COMPELLING - this is storytelling, not a Wikipedia article
- Focus on the PRODUCT/BRAND name, NOT the physical container or packaging
- Include struggles, innovations, key moments, and turning points
- Make it feel like a cinematic documentary`,
              },
            ],
          },
        ],
    });

    console.log('✅ Claude response received successfully');

    let responseData;
    try {
      // Extract text from Claude's response
      const responseText = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('');

      console.log('📝 Raw Claude response (first 500 chars):', responseText.substring(0, 500));
      console.log('📏 Full response length:', responseText.length, 'characters');

      // Check if Claude refused to analyze
      if (responseText.toLowerCase().includes("i'm sorry") || responseText.toLowerCase().includes("i cannot") || responseText.toLowerCase().includes("i can't")) {
        console.error('🚫 Claude refused to analyze. Full response:', responseText);
        throw new Error('Image analysis blocked. Please try a different image.');
      }

      console.log('🧹 Cleaning response text...');
      // Clean markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('✨ Cleaned text (first 300 chars):', cleanedText.substring(0, 300));

      console.log('🔍 Parsing JSON...');
      responseData = JSON.parse(cleanedText);
      console.log('✅ JSON parsed successfully');
      console.log('📊 Parsed data:', {
        subject: responseData.subject,
        type: responseData.type,
        stopsCount: responseData.stops?.length
      });

      // Validate required fields
      if (!responseData.subject || !responseData.stops || !Array.isArray(responseData.stops) || responseData.stops.length === 0) {
        console.error('❌ Invalid response structure. Missing required fields.');
        throw new Error('Invalid response structure');
      }

      console.log('✅ Response validation passed');
    } catch (parseError) {
      console.error('❌ Parse error:', parseError);

      // If it's a content moderation error, throw it to the user
      if (parseError instanceof Error && parseError.message.includes('content moderation')) {
        console.error('🚫 Content moderation error - throwing to user');
        throw parseError;
      }

      console.warn('⚠️  Using fallback data due to parse error');

      // Fallback with basic data
      responseData = {
        subject: 'Unknown Subject',
        type: 'other',
        description: 'An interesting subject with a story to discover',
        narrative: 'This subject has a fascinating history that spans across time and space.',
        stops: [
          {
            id: 'stop1',
            title: 'Origins',
            description: 'The beginning',
            location: { name: 'Origin Point', lat: 0, lng: 0 },
            story: 'Every story has a beginning, and this one starts here.',
            personName: 'Founder',
            personQuote: 'Innovation begins with a vision.',
            economicImpact: 'Significant cultural importance',
            duration: 'Early days'
          },
          {
            id: 'stop2',
            title: 'Development',
            description: 'Growth and evolution',
            location: { name: 'Development Phase', lat: 20, lng: 20 },
            story: 'Over time, this subject evolved and grew in significance.',
            personName: 'Key Figure',
            personQuote: 'Progress is inevitable.',
            economicImpact: 'Growing influence',
            duration: 'Growth period'
          },
          {
            id: 'stop3',
            title: 'Transformation',
            description: 'A pivotal moment',
            location: { name: 'Point of Change', lat: 30, lng: 50 },
            story: 'A critical transformation reshaped the trajectory of this story.',
            personName: 'Change Agent',
            personQuote: 'Change is the only constant.',
            economicImpact: 'Transformative impact',
            duration: 'Transitional period'
          },
          {
            id: 'stop4',
            title: 'Present Day',
            description: 'Current state',
            location: { name: 'Today', lat: 40.7128, lng: -74.0060 },
            story: 'Today, this subject continues to impact our world.',
            personName: 'Modern Observer',
            personQuote: 'The future is being written now.',
            economicImpact: 'Ongoing relevance',
            duration: 'Present'
          }
        ],
        startLocation: { name: 'Beginning', lat: 0, lng: 0 },
        endLocation: { name: 'Today', lat: 40.7128, lng: -74.0060 },
      };
    }

    // Use uploaded image directly as data URL
    const imageUrl = `data:${mediaType};base64,${base64}`;
    console.log('🖼️  Using uploaded image as data URL');

    console.log('🏗️  Building final journey response...');
    // Build final response
    const journey = {
      product: responseData.subject,
      productCategory: responseData.type || 'other',
      description: responseData.description,
      imageUrl: imageUrl,
      narrative: responseData.narrative,
      stops: responseData.stops.map((stop: any) => ({
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
        startLocation: responseData.startLocation,
        endLocation: responseData.endLocation,
      },
      totalDistance: `${responseData.stops?.length * 1500} km (estimated)`,
      musicUrl: undefined,
    };

    console.log('✅ Journey response built successfully');
    console.log('=== Analysis Complete ===\n');
    return NextResponse.json(journey);
  } catch (error) {
    console.error('❌ Error analyzing image:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('=== Analysis Failed ===\n');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
