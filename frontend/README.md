# AI Assistant Testing Frontend

A debug interface for testing AI assistant implementations with arbitrary conversation sequences.

## Features

- Create and manipulate conversation sequences with any combination of user, assistant, and system messages
- Reorder messages to test different conversation flows
- Select different assistant implementations (basic, RAG, web-search)
- Create and use system prompts
- Save and load conversation templates
- Export and import conversation state
- Stream responses from the selected assistant

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the debug interface.

Make sure the backend server is running at http://localhost:8000. You can start it using the Makefile in the root directory:

```bash
make fastapi
```

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Usage

### Creating Conversations

1. Use the message form to add new messages of any role (user, assistant, system)
2. Edit, remove, or reorder messages as needed
3. Set a system prompt (optional)
4. Select an assistant type

### Testing Responses

1. Create a conversation sequence
2. Click "Start Stream" to send the sequence to the backend
3. View the streaming response
4. The response will be automatically added to the conversation when complete

### Saving and Loading Templates

1. Create a conversation sequence you want to reuse
2. Enter a name in the template section and click "Save"
3. Later, click "Load" on any saved template to restore it

### Importing and Exporting

Use the Export/Import functionality to save conversation states as JSON or share them with others.

## Data Model

The application state includes:

- `messages`: Array of conversation messages with roles and content
- `selectedAssistant`: The assistant implementation to use
- `systemPrompt`: Optional system prompt to prepend to the conversation
- `savedTemplates`: Collection of saved conversation templates

## Tech Stack

This project uses:

- [Next.js](https://nextjs.org/) - React framework
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [FastAPI](https://fastapi.tiangolo.com/) - Backend API (in separate directory)