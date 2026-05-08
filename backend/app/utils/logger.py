import logging
import sys
from datetime import datetime
from pathlib import Path
import os

class CustomLogger:
    def __init__(self, name: str = "haveit"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Create logs directory if it doesn't exist
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        # File handler
        log_file = log_dir / f"{name}_{datetime.now().strftime('%Y%m%d')}.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
        
        # Prevent duplicate logs
        self.logger.propagate = False
    
    def info(self, message: str, extra: dict = None):
        log_message = self._format_message(message, extra)
        self.logger.info(log_message)
    
    def error(self, message: str, extra: dict = None):
        log_message = self._format_message(message, extra)
        self.logger.error(log_message)
    
    def warning(self, message: str, extra: dict = None):
        log_message = self._format_message(message, extra)
        self.logger.warning(log_message)
    
    def debug(self, message: str, extra: dict = None):
        log_message = self._format_message(message, extra)
        self.logger.debug(log_message)
    
    def _format_message(self, message: str, extra: dict = None) -> str:
        if extra:
            extra_str = " | " + " | ".join([f"{k}={v}" for k, v in extra.items()])
            return message + extra_str
        return message

# Create logger instances
api_logger = CustomLogger("api")
auth_logger = CustomLogger("auth")
payment_logger = CustomLogger("payment")
order_logger = CustomLogger("order")
websocket_logger = CustomLogger("websocket")
error_logger = CustomLogger("error")
