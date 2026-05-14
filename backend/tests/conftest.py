"""Pytest configuration: environment must be set before importing the FastAPI app."""

from __future__ import annotations

import os

os.environ.setdefault("SECRET_KEY", "ci-test-secret-key-32bytes-minimum!")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("CREATE_TABLES_ON_STARTUP", "false")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:5173")
os.environ.setdefault("SKIP_FIREBASE_INIT", "true")
os.environ.setdefault("ENVIRONMENT", "development")
