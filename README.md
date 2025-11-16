# X Post Generator - Powered by Google Gemini 2.5 Pro

A full-stack web application for generating high-quality X (Twitter) posts using Google's Gemini 2.5 Pro API. Built with React, Vite, Tailwind CSS, Node.js, and Express.

## 🌟 Features

### Core Functionality
- **AI-Powered Post Generation**: Generate engaging X posts using Google Gemini 2.5 Pro
- **System Prompt Management**: Create, edit, and manage multiple system prompts for different post styles
- **Flexible Configuration**: Per-prompt model configuration (temperature, tokens, topP, topK)
- **Real-time Character Counter**: Visual feedback for X's 280-character limit
- **Edit & Regenerate**: Edit generated posts before copying or regenerate for variations
- **Quality-Focused Logging**: Debug and analyze generation quality with detailed logs

### User Experience
- **Clean, Modern UI**: Dark mode interface with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile
- **X-Style Preview**: See exactly how your post will look
- **One-Click Copy**: Copy to clipboard with success feedback
- **Error Handling**: Clear, user-friendly error messages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com))

### Installation

1. **Clone and navigate to the repository**
```bash
cd /path/to/agsP
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure your Gemini API key**

Create or edit `backend/.env` file:
```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
LOG_GENERATIONS=true
FRONTEND_URL=http://localhost:5173
```

4. **Start the application**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:5173` (opens automatically)

## 🔑 Getting Your Gemini API Key

### Step-by-Step Guide:

1. **Visit Google AI Studio**
   - Go to [https://aistudio.google.com](https://aistudio.google.com)
   - Sign in with your Google account

2. **Get API Key**
   - Click "Get API Key" button in the top right
   - Click "Create API Key"
   - Choose "Create API key in new project" or select an existing project
   - Copy the generated API key

3. **Add to Configuration**
   - Open `backend/.env` file
   - Replace `your_api_key_here` with your actual API key
   - Save the file

### Free Tier Limits (as of 2024):
- **25 requests per day** - Perfect for daily posting and testing
- **5 requests per minute** - Rate limiting
- **No credit card required** - Completely free to start

**Note**: These limits are sufficient for crafting quality prompts and generating daily posts.

## 📁 Project Structure

```
agsP/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── CharacterCounter.jsx
│   │   │   ├── CopyButton.jsx
│   │   │   ├── PostGenerator.jsx
│   │   │   ├── PromptEditor.jsx
│   │   │   ├── PromptManager.jsx
│   │   │   └── PromptSelector.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx        # Main generator page
│   │   │   └── Prompts.jsx     # Prompt management
│   │   ├── services/
│   │   │   └── api.js          # API integration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── routes/             # API routes
│   │   │   ├── prompts.js      # CRUD for prompts
│   │   │   └── generate.js     # Post generation
│   │   ├── services/
│   │   │   ├── geminiService.js    # Gemini API integration
│   │   │   └── promptService.js    # Prompt management
│   │   ├── utils/
│   │   │   ├── fileHandler.js  # JSON file operations
│   │   │   └── logger.js       # Logging system
│   │   └── server.js           # Express server
│   ├── data/
│   │   └── systemPrompts.json  # Prompt storage
│   ├── logs/                   # Generation logs (optional)
│   ├── package.json
│   └── .env
│
├── package.json                 # Root package with scripts
└── README.md
```

## 🎯 Usage Guide

### 1. Creating Your First System Prompt

System prompts are **crucial** for quality output. They define how the AI generates posts.

**Steps:**
1. Navigate to "Manage Prompts" page
2. Click "New Prompt"
3. Fill in:
   - **Name**: Descriptive name (e.g., "Professional Tech Posts")
   - **System Prompt**: Detailed instructions for the AI (see example below)
   - **Model Config**: Adjust temperature, tokens, etc.
4. Save and test

**Example System Prompt:**
```
You are an expert X (Twitter) content creator specializing in technology and AI.

Your goal: Create engaging, insightful posts that educate and spark discussion.

Style Guidelines:
- Tone: Professional yet conversational
- Voice: First-person, authentic
- Length: Under 280 characters, optimally 220-260
- Format: Single posts with strategic line breaks

Content Rules:
1. Start with a compelling hook or insight
2. Provide clear value (tip, fact, or perspective)
3. End with engagement (question or thought-provoking statement)
4. Use 1-2 emojis maximum for emphasis
5. No hashtags unless specifically requested

Quality Standards:
- Natural language, not robotic
- Specific over generic
- Authentic voice, not corporate speak
- Actionable or thought-provoking

Avoid:
- Clickbait or sensationalism
- Overly promotional language
- Buzzwords without substance
- Generic motivational quotes
```

### 2. Generating Posts

1. **Select a Prompt**: Choose from your saved system prompts
2. **Enter Your Idea**: Describe what you want to post about
3. **Generate**: Click the generate button
4. **Review**: Check character count and quality
5. **Edit (Optional)**: Make any refinements
6. **Copy**: Click copy button to use in X

**Tips for Better Results:**
- Be specific in your input (more context = better output)
- Experiment with different prompts for different styles
- Use the regenerate button for variations
- Edit generated posts to add your personal touch

### 3. Optimizing Model Configuration

Each prompt can have custom model settings:

- **Temperature** (0-2):
  - Lower (0.3-0.7): More focused, consistent, professional
  - Higher (0.8-1.5): More creative, diverse, experimental

- **Max Output Tokens** (100-2000):
  - Recommended: 500-1000 for quality thinking
  - Higher allows more processing for better results

- **Top P** (0-1):
  - Default: 0.95
  - Controls diversity of word choice

- **Top K** (1-100):
  - Default: 40
  - Controls vocabulary variety

## 🛠️ API Documentation

### Backend Endpoints

#### Prompts Management

**GET /api/prompts**
- Get all system prompts
- Response: `{ success: true, data: [...], count: number }`

**GET /api/prompts/:id**
- Get single prompt by ID
- Response: `{ success: true, data: {...} }`

**POST /api/prompts**
- Create new prompt
- Body: `{ name, promptText, modelConfig? }`
- Response: `{ success: true, data: {...}, message }`

**PUT /api/prompts/:id**
- Update existing prompt
- Body: `{ name?, promptText?, modelConfig?, isActive? }`
- Response: `{ success: true, data: {...}, message }`

**DELETE /api/prompts/:id**
- Delete prompt (prevents deletion of last prompt)
- Response: `{ success: true, message }`

#### Post Generation

**POST /api/generate-post**
- Generate X post using Gemini API
- Body:
  ```json
  {
    "systemPromptId": "prompt-id",
    "userInput": "your topic/idea",
    "customConfig": {  // optional
      "temperature": 0.8
    }
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "text": "generated post",
      "characterCount": 150,
      "exceedsLimit": false,
      "metadata": {
        "model": "gemini-2.5-pro",
        "duration": 1250,
        "promptUsed": {...},
        "modelConfig": {...}
      }
    }
  }
  ```

## 🔧 Development

### Available Scripts

**Root Level:**
```bash
npm run install:all      # Install all dependencies
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build:frontend   # Build frontend for production
```

**Frontend (in /frontend):**
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

**Backend (in /backend):**
```bash
npm run dev             # Start with nodemon (auto-reload)
npm start               # Start production server
```

### Environment Variables

**Backend (.env):**
```env
GEMINI_API_KEY=         # Required: Your Gemini API key
PORT=5000               # Server port
NODE_ENV=development    # Environment
LOG_GENERATIONS=true    # Enable generation logging
FRONTEND_URL=           # Frontend URL for CORS
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000  # Backend API URL
```

## 🎨 Tech Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **@google/generative-ai**: Gemini SDK
- **CORS**: Cross-origin requests
- **dotenv**: Environment management
- **UUID**: Unique ID generation

### Storage
- **File-based JSON**: Simple, no database required
- **Easy to migrate**: Can move to database later if needed

## 📊 Quality & Debugging

### Generation Logging

When `LOG_GENERATIONS=true` in backend/.env, each generation is logged to `backend/logs/`:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "promptId": "...",
  "systemPrompt": "...",
  "userInput": "...",
  "generatedText": "...",
  "modelConfig": {...},
  "duration": 1250,
  "success": true
}
```

Use these logs to:
- Debug quality issues
- A/B test different prompts
- Analyze what works best
- Track improvements over time

## 🔒 Security

- ✅ API key stored in backend only (never exposed to frontend)
- ✅ CORS configured for specific origin
- ✅ Input validation on all endpoints
- ✅ Environment variables for sensitive data
- ✅ .env files in .gitignore
- ✅ Error messages don't expose internals

## 🚨 Common Issues & Solutions

### "Failed to generate post: Invalid API key"
**Solution**:
1. Check `backend/.env` has valid `GEMINI_API_KEY`
2. Ensure no extra spaces in the API key
3. Verify key is active at [Google AI Studio](https://aistudio.google.com)

### "API rate limit exceeded"
**Solution**:
- Free tier: 25 requests/day, 5/minute
- Wait and try again later
- Consider upgrading for higher limits

### Backend won't start / CORS errors
**Solution**:
1. Check `FRONTEND_URL` in backend/.env matches frontend URL
2. Ensure both servers are running
3. Check firewall/antivirus isn't blocking ports

### No prompts showing
**Solution**:
1. Check `backend/data/systemPrompts.json` exists
2. Ensure proper JSON format
3. Create a new prompt via UI

## 📝 Best Practices

### For System Prompts:
1. **Be Specific**: Define exact style, tone, and format
2. **Set Context**: Explain purpose and audience
3. **Include Examples**: Show what good looks like
4. **Define Constraints**: Character limits, hashtags, emojis
5. **Iterate**: Test and refine based on results

### For Post Generation:
1. **Provide Context**: More details = better output
2. **Test Variations**: Try different prompts/configs
3. **Edit Output**: Add personal touch before posting
4. **Monitor Quality**: Use logs to track what works
5. **Stay Authentic**: Edit to match your voice

## 🤝 Contributing

This is a quality-focused project. When contributing:
- Maintain code quality and comments
- Test thoroughly before submitting
- Follow existing patterns and structure
- Document new features

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 🙏 Acknowledgments

- Powered by [Google Gemini 2.5 Pro](https://deepmind.google/technologies/gemini/)
- Built with modern web technologies
- Designed for content creators who value quality

## 📞 Support

For issues or questions:
1. Check this README first
2. Review error messages and logs
3. Verify API key and configuration
4. Check [Gemini API documentation](https://ai.google.dev/docs)

---

**Built with focus on quality output. The better your system prompt, the better your posts!** ✨
