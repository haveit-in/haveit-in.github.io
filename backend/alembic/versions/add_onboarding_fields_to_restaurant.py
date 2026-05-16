"""add onboarding fields to restaurant

Revision ID: add_onboarding_fields
Revises: 
Create Date: 2026-05-16

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_onboarding_fields'
down_revision = None  # This will be set when you run the migration
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to restaurant_profiles table
    op.add_column('restaurant_profiles', sa.Column('food_type', sa.String(20), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('cost_for_two', sa.Numeric(10, 2), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('opening_time', sa.String(10), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('closing_time', sa.String(10), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('fssai_certificate_url', sa.Text(), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('pan_card_url', sa.Text(), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('bank_proof_url', sa.Text(), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('restaurant_images_urls', sa.Text(), nullable=True))
    op.add_column('restaurant_profiles', sa.Column('menu_url', sa.Text(), nullable=True))


def downgrade():
    # Remove the columns if rolling back
    op.drop_column('restaurant_profiles', 'menu_url')
    op.drop_column('restaurant_profiles', 'restaurant_images_urls')
    op.drop_column('restaurant_profiles', 'bank_proof_url')
    op.drop_column('restaurant_profiles', 'pan_card_url')
    op.drop_column('restaurant_profiles', 'fssai_certificate_url')
    op.drop_column('restaurant_profiles', 'closing_time')
    op.drop_column('restaurant_profiles', 'opening_time')
    op.drop_column('restaurant_profiles', 'cost_for_two')
    op.drop_column('restaurant_profiles', 'food_type')
