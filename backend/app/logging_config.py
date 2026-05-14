"""One-time logging setup for API processes."""

import logging
import sys

from app.config import Settings


def configure_logging(app_settings: Settings) -> None:
    level_name = app_settings.log_level.upper()
    level = getattr(logging, level_name, logging.INFO)

    root = logging.getLogger()
    if root.handlers:
        root.setLevel(level)
    else:
        logging.basicConfig(
            level=level,
            format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
            stream=sys.stdout,
        )

    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
