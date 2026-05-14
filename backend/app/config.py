"""Application configuration loaded from the environment (12-factor style)."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = "INFO"
    """Root log level, e.g. INFO, WARNING, DEBUG."""

    debug_http: bool = False
    """When true, log full request/response metadata (never enable in production)."""


settings = Settings()
