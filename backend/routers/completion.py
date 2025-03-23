from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from schemas.completion import CompletionRequest
from ai.assistants.basic import basic_response
from ai.assistants.rag import rag_response
from ai.assistants.web_search import web_search_response

router = APIRouter(
    prefix="/completion"
)

@router.post("/stream")
async def stream_response(request: CompletionRequest):
    assistant = request.assistant
    system_prompt = request.system_prompt
    conversation = [msg.model_dump() for msg in request.conversation]
    match assistant:
        case "basic":
            response = basic_response
        case "rag":
            response = rag_response
        case "web-search":
            response = web_search_response
        case _:
            raise ValueError(f"unrecognized assistant {assistant}. This should never happen")
    return StreamingResponse(response(conversation, system_prompt))