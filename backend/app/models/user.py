from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = Column(String, unique=True, nullable=False)
    email = Column(String)
    phone = Column(String)
    name = Column(String)
    photo_url = Column(String)
    role = Column(String, default="user")
    profile_completed = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
