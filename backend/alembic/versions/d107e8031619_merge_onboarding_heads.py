"""merge onboarding heads

Revision ID: d107e8031619
Revises: add_onboarding_fields, f8e7d6c5b4a3
Create Date: 2026-05-16 17:42:20.061761

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd107e8031619'
down_revision: Union[str, None] = ('add_onboarding_fields', 'f8e7d6c5b4a3')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
