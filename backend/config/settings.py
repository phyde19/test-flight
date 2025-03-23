from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    api_name: str = "LLM agent prototyping API"
    openai_api_key: str

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env"
    )


settings = Settings()