"""
Image Analysis Worker for Pistis Labs
Analyzes images using Claude API and generates story narratives
"""
from runpod_flash import LiveServerless, remote
import os

# Configure for CPU workers (Claude API doesn't need GPU)
config = LiveServerless(
    name="pistis-image-analysis",
    workersMin=0,  # Scale to zero when idle
    workersMax=1,  # Minimal - just 1 worker
    idleTimeout=300,  # 5 minutes idle timeout
)


@remote(
    resource_config=config,
    dependencies=["anthropic==0.79.0"]
)
async def analyze_image(image_base64: str, media_type: str) -> dict:
    """
    Analyze an image and generate a rich narrative story.

    Args:
        image_base64: Base64-encoded image data
        media_type: Image MIME type (e.g., 'image/jpeg')

    Returns:
        dict: Journey data with subject, type, narrative, and stops
    """
    from anthropic import Anthropic
    import json

    # Get API key from environment
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in environment")

    client = Anthropic(api_key=api_key)

    # Prepare the prompt
    prompt_text = """Analyze this image and create a RICH, DETAILED, COMPELLING story about what you see. Focus on the MAIN SUBJECT (product, brand, or item), not background details.

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
- Make it feel like a cinematic documentary"""

    try:
        # Call Claude API
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=8000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_base64,
                            },
                        },
                        {
                            "type": "text",
                            "text": prompt_text,
                        },
                    ],
                }
            ],
        )

        # Extract text from response
        response_text = ''.join(
            block.text for block in response.content if hasattr(block, 'text')
        )

        # Clean markdown code blocks if present
        cleaned_text = response_text.replace('```json\n', '').replace('```\n', '').replace('```', '').strip()

        # Parse JSON
        data = json.loads(cleaned_text)

        # Validate required fields
        if not data.get('subject') or not data.get('stops'):
            raise ValueError('Invalid response structure from Claude')

        return {
            "status": "success",
            "data": data
        }

    except json.JSONDecodeError as e:
        return {
            "status": "error",
            "error": f"Failed to parse JSON response: {str(e)}",
            "raw_response": cleaned_text[:500]  # First 500 chars for debugging
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


# Test locally
if __name__ == "__main__":
    import asyncio

    # Sample test (would need actual base64 image)
    test_payload = {
        "image_base64": "test",
        "media_type": "image/jpeg"
    }

    print("Testing image analysis worker...")
    result = asyncio.run(analyze_image(
        image_base64=test_payload["image_base64"],
        media_type=test_payload["media_type"]
    ))
    print(f"Result: {result}")
