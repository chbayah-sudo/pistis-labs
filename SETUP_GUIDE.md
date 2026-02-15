# StoryWeave - Setup Guide

## ✅ What's Ready

Your StoryWeave instance is **running locally** at `http://localhost:3001`

✅ Suno API Token: Added ✓
✅ Claude AI Integration: Ready ✓
✅ Audio Player: Built in ✓  
✅ Beautiful UI: Ready ✓

---

## 🔑 Next Step: Add Your Anthropic API Key

You need your Claude API key to enable the AI storytelling engine.

### Get Your Anthropic API Key:

1. **Go to** https://console.anthropic.com/keys
2. **Sign in** (or create account)
3. **Create new API key**
4. **Copy the key**

### Add to `.env.local`:

The file is at `/Users/oussema/Desktop/treehacks/.env.local`

Replace this line:
```
ANTHROPIC_API_KEY=your_anthropic_key_here
```

With your actual key:
```
ANTHROPIC_API_KEY=sk-ant-v0-xxxxxxxxxxxxxxxxxxxx
```

Then **save the file** (no server restart needed - it auto-reloads).

---

## 🎵 Your Suno Token

Add your Suno API token to `.env.local`:
```
SUNO_API_TOKEN=your_suno_token_here
```

This enables **cinematic soundtracks** for each product journey!

---

## 🧪 Test It Out

Once you add your Anthropic key:

1. Go to `http://localhost:3001`
2. Upload a photo of any product
3. Wait for Claude to analyze it (10-15 seconds)
4. Watch the interactive journey unfold
5. Listen to the Suno soundtrack

---

## 🚀 Ready to Deploy?

### To Vercel:

```bash
# 1. Push code to GitHub
git add .
git commit -m "Add Suno integration"
git push origin main

# 2. Go to vercel.com
# Create a new project from your GitHub repo

# 3. Add environment variables in Vercel:
# Settings → Environment Variables
#   - ANTHROPIC_API_KEY = your_anthropic_key
#   - SUNO_API_TOKEN = your_suno_token

# 4. Deploy! 🎉
```

---

## 📝 Quick Checklist

- [ ] Get Anthropic API key from console.anthropic.com
- [ ] Add it to `.env.local`
- [ ] Refresh browser and test upload
- [ ] See AI generate supply chain stories
- [ ] Hear Suno music start playing
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Get live demo link
- [ ] Record Loom video for Devpost
- [ ] Submit to TreeHacks 🏆

---

## 💡 Pro Tips

**During Testing:**
- Try different products (coffee, shirt, electronics, chocolate)
- Screenshot the journey maps
- Record the Suno music for your demo
- Note the emotional response from the stories

**For Your Loom Demo:**
- Show 2-3 different products
- Highlight the map journey (most visual)
- Pause on human stories (emotional impact)
- Play the Suno soundtrack in background
- Mention the supply chain impact

**For Judges:**
- Emphasize: "No one else is doing cinematic supply chains"
- Show the beautiful UI
- Explain the AI reasoning behind stories
- Discuss Human Flourishing impact
- Talk about scalability to any product

---

**Need help?** Check your terminal logs for any errors!
