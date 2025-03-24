from typing import Generator, TypedDict, Literal
from ai.models import openai
from ai.types import MessageDict

default_system = f"""
You are a helpful assistant.
"""

def llm(conversation: list[MessageDict], system_message: str | None = None):
    messages = list(conversation)  # Create a copy to avoid modifying the original
    
    # Only prepend system message if provided and there's no system message at the start
    if system_message and (not messages or messages[0]['role'] != 'system'):
        messages.insert(0, {"role": "system", "content": system_message})
    elif not messages:  # Empty conversation, add default system message
        messages.append({"role": "system", "content": default_system})
    
    completion = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    return completion.choices[0].message.content

def llm_stream(conversation: list[MessageDict], system_message: str | None = None) -> Generator[str, None, None]:
    messages = list(conversation)  # Create a copy to avoid modifying the original
    
    # Only prepend system message if provided and there's no system message at the start
    if system_message and (not messages or messages[0]['role'] != 'system'):
        messages.insert(0, {"role": "system", "content": system_message})
    elif not messages:  # Empty conversation, add default system message
        messages.append({"role": "system", "content": default_system})
    
    stream = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        stream=True
    )
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content