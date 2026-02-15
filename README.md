# Pistis Labs 🌍

**Everything has a story. Discover the untold narrative behind every image.**

---

## What is Pistis Labs?

Pistis Labs is an AI-powered storytelling platform that reveals the hidden history, journey, and context behind any image you upload. Whether it's a product, a place, a historical moment, or a living thing—our AI traces its origins, evolution, and impact through an immersive, cinematic narrative experience.

**Key Features:**

- 📸 **Universal Image Analysis**: Upload photos of products, places, creatures, or moments
- 🤖 **AI-Powered Storytelling**: Claude AI creates rich, detailed narratives with historical context
- 🗺️ **Interactive Journey Maps**: Explore geographic journeys with Mapbox integration
- 📍 **Location-Based Imagery**: Each chapter features contextual images of real places
- 🎬 **Cinematic Narratives**: Documentary-style storytelling with emotional depth
- 💡 **Deep Context**: Discover economic impact, cultural significance, and human stories

---

## How It Works

1. **Upload** - Take or upload a photo of anything: a product label, landmark, species, or moment
2. **Analyze** - Claude AI identifies the subject and researches its history, origins, and journey
3. **Experience** - Navigate through an interactive story with maps, images, and rich narratives
4. **Discover** - Learn about the people, places, and events that shaped what you see

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **AI Engine**: Anthropic Claude API (Haiku 4.5)
- **Maps**: Mapbox GL JS
- **Images**: Pexels API + Unsplash
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key
- Mapbox access token (optional but recommended)
- Pexels API key (optional but recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd treehacks
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with your API keys:
```env
ANTHROPIC_API_KEY=your_anthropic_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
PEXELS_API_KEY=your_pexels_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page with image upload
│   └── api/
│       ├── analyze/route.ts        # Main AI analysis endpoint
│       └── image/[subject]/route.ts # Image fetching API
├── components/
│   ├── ImageUpload.tsx             # Drag-and-drop upload interface
│   ├── JourneyViewer.tsx           # Main story viewer
│   ├── JourneyMap.tsx              # Interactive Mapbox component
│   └── StoryPanel.tsx              # Narrative display panel
└── types/
    └── index.ts                    # TypeScript type definitions
```

---

## Features

### AI-Powered Analysis
- Uses Claude Haiku 4.5 for fast, detailed image analysis
- Generates 4-chapter narratives with rich historical context
- Creates realistic GPS coordinates and location data
- Includes person stories, quotes, and economic impact

### Interactive Maps
- Mapbox GL JS integration with custom markers
- Animated journey routes between locations
- Click markers to view location-specific images
- Auto-fitting bounds for optimal viewing

### Contextual Images
- Fetches relevant images for each story location
- Combines location names with subject context for better results
- Fallback images ensure every location displays properly
- Support for Pexels and Unsplash APIs

### Beautiful UI
- Minimalist, elegant design with dark mode
- Smooth animations and transitions
- Responsive layout for all devices
- Accessible navigation and controls

---

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Your Anthropic Claude API key

Optional but recommended:
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox access token for maps
- `PEXELS_API_KEY` - Pexels API key for location images
- `NEXT_PUBLIC_API_URL` - Production URL (defaults to localhost:3000)

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check
```

---

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect Next.js and configure optimal settings.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see LICENSE file for details

---

## Acknowledgments

- Built with [Anthropic Claude](https://www.anthropic.com)
- Maps powered by [Mapbox](https://www.mapbox.com)
- Images from [Pexels](https://www.pexels.com) and [Unsplash](https://unsplash.com)

---

**Pistis Labs** - *Revealing the stories hidden in plain sight.*
