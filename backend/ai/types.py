from typing import TypedDict, Literal

class MessageDict(TypedDict):
    role: Literal["user", "assistant", "system"]
    content: str