# Compass Simulator - AI assistant Prototyping Environment

Compass Simulator is a development environment for prototyping and testing AI/LLM assistant implementations. It consists of a notebook-style frontend interface and a modular backend that makes it easy to experiment with different assistant architectures and capabilities.

## Features

- 📝 Notebook-style interface for conversation testing
- 🔄 Support for multiple assistant types (basic, RAG, web-search)
- 🔧 Easily extensible architecture for creating new assistants
- 🧩 Custom parameter support via JSON panel
- 🚀 Hot-reloading for both frontend and backend development

## Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 16+
- npm

### Backend Setup

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd test-flight
   ```

2. Create and activate a virtual environment using the provided script:
   ```bash
   chmod +x venv.sh
   ./venv.sh
   ```

3. Install backend dependencies:
   ```bash
   make backend_install
   ```

4. Create a `.env` file in the `backend` directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   make frontend_install
   ```

## Running the Application

Start both the frontend and backend services with a single command:

```bash
make start
```

This will launch:
- Backend API on http://localhost:8000
- Frontend on http://localhost:3000

## Using the Interface

### Basic Controls

- **Assistant Selection**: Choose between different assistant types (Basic, RAG, Web Search)
- **Add Messages**: Add user or assistant messages to test specific scenarios
- **Run**: Execute the conversation with the selected assistant
- **Stop**: Interrupt a running stream
- **Clear All**: Reset the conversation

### Message Cells

- **Edit Messages**: Click on any message cell to edit its content
- **Move Messages**: Use the up/down arrows on the left side of messages to reorder them
- **Delete Messages**: Remove messages with the trash icon
- **Regenerate**: Create a new assistant response based on the conversation up to that point

### Keyboard Shortcuts

- **Shift+Enter**: Save when editing a message

### Custom Parameters

Click the JSON button in the toolbar to open the parameters panel, which allows you to:
1. Enable/disable custom parameters
2. Set the parameter name
3. Define the JSON value to be included in requests to the API

## Development Guide

### Project Structure

```
test-flight/
├── backend/
│   ├── ai/
│   │   ├── assistants/       # assistant implementations
│   │   │   ├── basic.py      # Basic chat completion
│   │   │   ├── rag.py        # Retrieval-augmented generation
│   │   │   └── web_search.py # Web search augmented assistant
│   │   ├── completions.py    # Core LLM interaction functions
│   │   ├── models.py         # LLM client setup
│   │   └── types.py          # Type definitions
│   ├── config/
│   │   └── settings.py       # Application configuration
│   ├── routers/
│   │   ├── completion.py     # API endpoints for completions
│   │   └── info.py           # Info and health endpoints
│   ├── schemas/
│   │   └── completion.py     # Request/response models
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── components/       # React components
│   │   ├── stores/           # Zustand state management
│   │   └── page.tsx          # Main application page
│   └── ...
├── Makefile                  # Development commands
└── venv.sh                   # Virtual environment setup
```

### Creating a New assistant

#### Backend

1. Create a new file in `backend/ai/assistants/` (e.g., `my_assistant.py`):

```python
from typing import Generator
from ai.types import MessageDict
from ai.completions import llm_stream

def my_assistant_response(conversation: list[MessageDict], system_prompt: str | None = None) -> Generator[str, None, None]:
    # Your assistant logic here
    # For example, you can add preprocessing, call external APIs, etc.
    
    # Then use the core LLM function to generate a response
    for chunk in llm_stream(conversation, system_prompt):
        yield chunk
```

2. Register the assistant in `backend/routers/completion.py`:

```python
from ai.assistants.my_assistant import my_assistant_response

# In the stream_response function, add to the match statement:
match assistant:
    case "basic":
        response = basic_response
    case "rag":
        response = rag_response
    case "web-search":
        response = web_search_response
    case "my-assistant":  # Add your new assistant here
        response = my_assistant_response
    case _:
        raise ValueError(f"unrecognized assistant {assistant}. This should never happen")
```

#### Frontend

1. Update the `AssistantType` type in `frontend/app/stores/conversationStore.ts`:

```typescript
export type AssistantType = 'basic' | 'rag' | 'web-search' | 'my-assistant';
```

2. Add the new assistant option to the dropdown in `frontend/app/components/Toolbar.tsx`:

```tsx
<select
  value={selectedAssistant}
  onChange={(e) => onChangeAssistant(e.target.value as AssistantType)}
  className="py-1 px-2 text-sm border rounded bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
>
  <option value="basic">Basic</option>
  <option value="rag">RAG</option>
  <option value="web-search">Web Search</option>
  <option value="my-assistant">My assistant</option>
</select>
```