"""Add partner authentication tables and columns

Revision ID: partner_auth_001
Revises: 
Create Date: 2026-04-29 01:18:12.982136

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'partner_auth_001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Add roles to users and create restaurants table."""
    
    # Add roles column to users table (if it doesn't exist)
    try:
        op.add_column('users', sa.Column('roles', postgresql.ARRAY(sa.String()), server_default='{"user"}', nullable=False))
    except:
        pass
    
    # Drop old role column if it exists
    try:
        op.drop_column('users', 'role')
    except:
        pass
    
    # Create restaurants table
    op.create_table(
        'restaurants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('cuisine_types', sa.String(), nullable=True),
        sa.Column('fssai_license', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default='pending', nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_restaurants_id'), 'restaurants', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema - Remove restaurants table and revert users changes."""
    
    # Drop restaurants table
    op.drop_index(op.f('ix_restaurants_id'), table_name='restaurants')
    op.drop_table('restaurants')
    
    # Remove roles and add back role column
    try:
        op.drop_column('users', 'roles')
    except:
        pass
    
    try:
        op.add_column('users', sa.Column('role', sa.String(), server_default='user', nullable=True))
    except:
        pass
