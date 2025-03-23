from typing import Generator, TypedDict, Literal
from ai.models import openai
from ai.types import MessageDict

default_system = f"""
You are a helpful assistant.
"""

def llm(conversation: list[MessageDict], system_message: str | None = None):
    if system_message is None:
        system_message = default_system
    completion = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_message},
            *conversation
        ]
    )
    return completion.choices[0].message.content

def llm_stream(conversation: list[MessageDict], system_message: str | None = None) -> Generator[str, None, None]:
    if system_message is None:
        system_message = default_system
    stream = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_message},
            *conversation
        ],
        stream=True
    )
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content