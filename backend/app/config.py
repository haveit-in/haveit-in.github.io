"""Application configuration loaded from the environment (12-factor style)."""

from pydantic import AliasChoices, Field, field_validator, model_validator
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

    environment: str = Field(
        default="development",
        validation_alias=AliasChoices("ENVIRONMENT", "APP_ENV"),
    )
    """Logical environment name (development, staging, production)."""

    create_tables_on_startup: bool = Field(
        default=False,
        validation_alias=AliasChoices("CREATE_TABLES_ON_STARTUP"),
    )
    """
    When true, SQLAlchemy create_all runs on process start.
    Use only for local/dev; production must use Alembic migrations only.
    """

    cors_origins: str = Field(
        default=(
            "http://localhost:5173,http://localhost:5174,"
            "http://localhost:3000,https://haveit-official.vercel.app"
        ),
        validation_alias=AliasChoices("CORS_ORIGINS"),
    )
    """Comma-separated browser origins allowed by CORS."""

    secret_key: str = Field(
        ...,
        min_length=16,
        validation_alias=AliasChoices("SECRET_KEY", "JWT_SECRET_KEY"),
    )
    """Primary HS256 signing key for JWTs. Keep long and random in production."""

    secret_key_previous: str | None = Field(
        default=None,
        validation_alias=AliasChoices("SECRET_KEY_PREVIOUS", "JWT_SECRET_KEY_PREVIOUS"),
    )
    """
    Previous signing key, accepted for verification only during rotation.
    After rotation, keep the old value here until all outstanding JWTs expire,
    then clear it.
    """

    access_token_expire_minutes: int = Field(
        default=15,
        ge=1,
        le=24 * 60,
        validation_alias=AliasChoices("ACCESS_TOKEN_EXPIRE_MINUTES"),
    )

    refresh_token_expire_days: int = Field(
        default=14,
        ge=1,
        le=365,
        validation_alias=AliasChoices("REFRESH_TOKEN_EXPIRE_DAYS"),
    )

    RAZORPAY_KEY_ID: str = Field(default="", validation_alias=AliasChoices("RAZORPAY_KEY_ID"))
    RAZORPAY_KEY_SECRET: str = Field(
        default="", validation_alias=AliasChoices("RAZORPAY_KEY_SECRET")
    )

    @model_validator(mode="after")
    def production_must_not_autocreate_tables(self) -> "Settings":
        if self.environment == "production" and self.create_tables_on_startup:
            raise ValueError(
                "CREATE_TABLES_ON_STARTUP cannot be true when ENVIRONMENT is production; "
                "use Alembic migrations only."
            )
        return self

    @field_validator("environment")
    @classmethod
    def normalize_environment(cls, v: str) -> str:
        return (v or "development").strip().lower()

    def cors_origin_list(self) -> list[str]:
        return [part.strip() for part in self.cors_origins.split(",") if part.strip()]


settings = Settings()
