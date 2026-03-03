# Jarvis AI Assistant

A modern AI chatbot powered by OpenRouter with file upload and analysis capabilities.

## Features

- Real-time streaming chat interface
- File upload support (code, documents, images)
- Beautiful dark theme with cyan accent colors
- Type-safe TypeScript implementation
- Responsive design

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS + shadcn/ui components
- OpenRouter SDK (Qwen3 Coder model)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenRouter API Key

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

3. Add your API key to `.env`:

```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Usage

1. Type your message in the input field
2. Upload files using the paperclip icon (supports code, documents, images)
3. Press Enter or click Send to chat with Jarvis
4. Shift + Enter for new lines

## File Support

Supported file types:
- Code files (.js, .ts, .jsx, .tsx, .py, .java, .cpp, .c, .h)
- Documents (.txt, .md, .json, .csv, .xml, .yaml, .yml)
- Web files (.html, .css)
- Images (displayed as previews)

## Security

- API keys are stored in environment variables (not in code)
- `.env` file is gitignored to prevent accidental commits
- All file processing happens client-side

## License

MIT
