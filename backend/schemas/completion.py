from pydantic import BaseModel
from typing import Literal

Role = Literal["user", "assistant", "system"]
Assistant = Literal["basic", "web-search", "rag"]

class Message(BaseModel):
    role: Role
    content: str

class CompletionRequest(BaseModel):
    # responding assistant (to the regional manager)
    assistant: Assistant
    # optional system prompt from client
    system_prompt: str | None = None
    # list of conversation messages: user | assistant
    conversation: list[Message]