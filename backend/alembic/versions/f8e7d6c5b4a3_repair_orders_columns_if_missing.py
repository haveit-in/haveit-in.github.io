"""Repair orders / order_items / order_tracking if DB drifted from Alembic head.

Revision ID: f8e7d6c5b4a3
Revises: create_payments_table
Create Date: 2026-05-13

Some databases were stamped at ``create_payments_table`` without ever applying
``93fb96c7f863`` DDL on ``orders``. This revision adds missing pieces idempotently.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, text
from sqlalchemy.dialects import postgresql

revision: str = "f8e7d6c5b4a3"
down_revision: Union[str, None] = "create_payments_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _order_columns(bind) -> set:
    insp = inspect(bind)
    if not insp.has_table("orders"):
        return set()
    return {c["name"] for c in insp.get_columns("orders")}


def _has_unique_on_order_number(bind) -> bool:
    insp = inspect(bind)
    for u in insp.get_unique_constraints("orders"):
        names = list(u.get("column_names") or [])
        if names == ["order_number"]:
            return True
    return False


def _upgrade_restaurant_fk_to_profile_id(bind) -> None:
    insp = inspect(bind)
    for fk in insp.get_foreign_keys("orders"):
        if (fk.get("constrained_columns") or []) != ["restaurant_id"]:
            continue
        if fk.get("referred_table") != "restaurant_profiles":
            continue
        referred = fk.get("referred_columns") or []
        if referred == ["id"]:
            return
        if referred == ["user_id"]:
            op.drop_constraint(fk["name"], "orders", type_="foreignkey")
            op.create_foreign_key(
                "fk_orders_restaurant_id",
                "orders",
                "restaurant_profiles",
                ["restaurant_id"],
                ["id"],
            )
            return


def upgrade() -> None:
    bind = op.get_bind()
    insp = inspect(bind)
    if not insp.has_table("orders"):
        return

    cols = _order_columns(bind)

    if "order_number" not in cols:
        op.add_column(
            "orders", sa.Column("order_number", sa.String(length=50), nullable=True)
        )
        op.execute(
            text(
                "UPDATE orders SET order_number = "
                "'HVT-LEG-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 12)) "
                "WHERE order_number IS NULL"
            )
        )
        op.alter_column(
            "orders",
            "order_number",
            existing_type=sa.String(50),
            nullable=False,
        )
        cols.add("order_number")

    if not _has_unique_on_order_number(bind):
        op.create_unique_constraint(
            "uq_orders_order_number", "orders", ["order_number"]
        )

    if "subtotal" not in cols:
        op.add_column(
            "orders",
            sa.Column(
                "subtotal",
                sa.Numeric(precision=10, scale=2),
                nullable=True,
            ),
        )
        op.execute(
            text(
                "UPDATE orders SET subtotal = COALESCE(total_amount, 0) "
                "WHERE subtotal IS NULL"
            )
        )
        op.alter_column(
            "orders",
            "subtotal",
            existing_type=sa.Numeric(10, 2),
            nullable=False,
        )
        cols.add("subtotal")

    if "tax_amount" not in cols:
        op.add_column(
            "orders",
            sa.Column(
                "tax_amount", sa.Numeric(precision=10, scale=2), nullable=True
            ),
        )
        op.execute(text("UPDATE orders SET tax_amount = 0 WHERE tax_amount IS NULL"))
        op.alter_column(
            "orders",
            "tax_amount",
            existing_type=sa.Numeric(10, 2),
            nullable=False,
        )
        cols.add("tax_amount")

    if "delivery_fee" not in cols:
        op.add_column(
            "orders",
            sa.Column(
                "delivery_fee", sa.Numeric(precision=10, scale=2), nullable=True
            ),
        )
        op.execute(
            text("UPDATE orders SET delivery_fee = 0 WHERE delivery_fee IS NULL")
        )
        op.alter_column(
            "orders",
            "delivery_fee",
            existing_type=sa.Numeric(10, 2),
            nullable=False,
        )
        cols.add("delivery_fee")

    if "payment_method" not in cols:
        op.add_column(
            "orders",
            sa.Column("payment_method", sa.String(length=50), nullable=True),
        )
        cols.add("payment_method")

    if "payment_status" not in cols:
        op.add_column(
            "orders",
            sa.Column("payment_status", sa.String(length=50), nullable=True),
        )
        cols.add("payment_status")

    if "order_status" not in cols:
        op.add_column(
            "orders",
            sa.Column("order_status", sa.String(length=50), nullable=True),
        )
        if "status" in cols:
            op.execute(
                text(
                    "UPDATE orders SET order_status = COALESCE(status, 'pending') "
                    "WHERE order_status IS NULL"
                )
            )
        else:
            op.execute(
                text(
                    "UPDATE orders SET order_status = 'pending' "
                    "WHERE order_status IS NULL"
                )
            )
        cols.add("order_status")

    if "delivery_address" not in cols:
        op.add_column("orders", sa.Column("delivery_address", sa.Text(), nullable=True))
        cols.add("delivery_address")

    if "customer_lat" not in cols:
        op.add_column(
            "orders",
            sa.Column("customer_lat", sa.Numeric(precision=10, scale=8), nullable=True),
        )
        cols.add("customer_lat")

    if "customer_lng" not in cols:
        op.add_column(
            "orders",
            sa.Column("customer_lng", sa.Numeric(precision=11, scale=8), nullable=True),
        )
        cols.add("customer_lng")

    if "estimated_delivery_time" not in cols:
        op.add_column(
            "orders",
            sa.Column("estimated_delivery_time", sa.String(length=50), nullable=True),
        )
        cols.add("estimated_delivery_time")

    if "updated_at" not in cols:
        op.add_column(
            "orders",
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )
        op.execute(
            text(
                "UPDATE orders SET updated_at = COALESCE(created_at, NOW()) "
                "WHERE updated_at IS NULL"
            )
        )
        cols.add("updated_at")

    if "status" in cols and "order_status" in cols:
        op.drop_column("orders", "status")

    _upgrade_restaurant_fk_to_profile_id(bind)

    if not insp.has_table("order_items"):
        op.create_table(
            "order_items",
            sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("menu_item_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("item_name", sa.String(length=255), nullable=False),
            sa.Column("quantity", sa.Integer(), nullable=False),
            sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column("total_price", sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(["menu_item_id"], ["menu_items.id"]),
            sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )

    if not insp.has_table("order_tracking_logs"):
        op.create_table(
            "order_tracking_logs",
            sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("status", sa.String(length=50), nullable=False),
            sa.Column("message", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )


def downgrade() -> None:
    pass
