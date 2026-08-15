# Task Capture Agent

A voice-enabled task capture and management system powered by Claude AI.

## Features

- 🎤 **Speech-to-Text**: Speak your tasks directly into your iPhone
- 🤖 **AI-Powered Categorization**: Claude automatically sorts tasks into research, tasks, ideas, or urgent
- 💾 **Persistent Storage**: Everything saves locally in your browser
- 📧 **Email Summaries**: Generate and copy formatted summaries to email to yourself
- 🎯 **Priority & Deadlines**: Claude suggests priority levels and due dates
- 📱 **Mobile Optimized**: Works perfectly on iPhone, iPad, Android, or desktop

## Quick Start

### Deploy to Vercel (Easiest)

See [DEPLOY.md](./DEPLOY.md) for step-by-step instructions.

Takes ~5 minutes and you get a live URL to bookmark on your iPhone.

### Run Locally

```bash
# Install dependencies
npm install

# Create .env.local and add your API key
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# Run dev server
npm run dev

# Open http://localhost:3000
```

## How to Use

1. **Capture**: Tap the microphone and speak your task/idea/research topic
2. **Categorize**: Claude analyzes and suggests category, priority, and deadline
3. **Review**: See your tasks organized by type
4. **Manage**: Mark complete, delete, or copy summaries
5. **Share**: Copy formatted summary to email

## Example Inputs

- "Research the latest updates on EML4-ALK fusion therapy"
- "Task: prepare medical summary by Friday"
- "Urgent: check drug interactions"
- "Idea: explore Jung's work on Eastern philosophy"

## Requirements

- Modern web browser (Chrome, Safari, Firefox, Edge)
- Anthropic API key (get one free at https://console.anthropic.com/)
- Microphone access on your device

## Environment Variables

```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
```

## Storage

All tasks are stored in your browser's local storage. Nothing is sent to any server except Claude API calls.

## Technologies

- Next.js
- React
- Tailwind CSS
- Lucide Icons
- Web Speech API
- Claude API

## License

MIT
