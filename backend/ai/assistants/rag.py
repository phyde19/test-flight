from typing import Generator

from ai.types import MessageDict
from ai.completions import llm_stream

def rag_response(conversation: list[MessageDict], system_prompt: str | None = None) -> Generator[str, None, None]:
    for chunk in llm_stream(conversation, system_prompt):
        yield chunk