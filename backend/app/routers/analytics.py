from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from decimal import Decimal
from ..database import get_db
from ..models import (
    Order,
    OrderItem,
    Product,
    Supplier,
    Customer,
    Warehouse,
    Inventory,
    LogisticsProvider,
    ShipmentTracking,
)
from ..auth import get_current_user

router = APIRouter()


def serialize_decimal(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    return obj


@router.get("/overview")
def get_overview(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    total_orders = db.query(func.count(Order.order_id)).scalar()
    total_customers = db.query(func.count(Customer.customer_id)).scalar()
    total_products = db.query(func.count(Product.product_id)).scalar()
    total_suppliers = db.query(func.count(Supplier.supplier_id)).scalar()
    total_warehouses = db.query(func.count(Warehouse.warehouse_id)).scalar()

    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0

    pending_orders = (
        db.query(func.count(Order.order_id)).filter(Order.status == "pending").scalar()
    )
    processing_orders = (
        db.query(func.count(Order.order_id))
        .filter(Order.status == "processing")
        .scalar()
    )
    shipped_orders = (
        db.query(func.count(Order.order_id)).filter(Order.status == "shipped").scalar()
    )
    delivered_orders = (
        db.query(func.count(Order.order_id))
        .filter(Order.status == "delivered")
        .scalar()
    )

    return {
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
        "total_suppliers": total_suppliers,
        "total_warehouses": total_warehouses,
        "total_revenue": serialize_decimal(total_revenue),
        "orders_by_status": {
            "pending": pending_orders,
            "processing": processing_orders,
            "shipped": shipped_orders,
            "delivered": delivered_orders,
        },
    }


@router.get("/revenue-by-customer")
def get_revenue_by_customer(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    results = (
        db.query(Customer.name, func.sum(Order.total_amount).label("total_revenue"))
        .join(Order, Customer.customer_id == Order.customer_id)
        .group_by(Customer.customer_id, Customer.name)
        .order_by(func.sum(Order.total_amount).desc())
        .limit(10)
        .all()
    )

    return [{"name": r[0], "revenue": serialize_decimal(r[1])} for r in results]


@router.get("/orders-by-status")
def get_orders_by_status(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    results = (
        db.query(Order.status, func.count(Order.order_id).label("count"))
        .group_by(Order.status)
        .all()
    )

    return [{"status": r[0], "count": r[1]} for r in results]


@router.get("/inventory-by-warehouse")
def get_inventory_by_warehouse(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    results = (
        db.query(Warehouse.name, func.sum(Inventory.quantity).label("total_quantity"))
        .join(Inventory, Warehouse.warehouse_id == Inventory.warehouse_id)
        .group_by(Warehouse.warehouse_id, Warehouse.name)
        .all()
    )

    return [{"warehouse": r[0], "quantity": r[1]} for r in results]


@router.get("/top-products")
def get_top_products(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    results = (
        db.query(Product.name, func.sum(OrderItem.quantity).label("total_ordered"))
        .join(OrderItem, Product.product_id == OrderItem.product_id)
        .group_by(Product.product_id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(10)
        .all()
    )

    return [{"product": r[0], "quantity": r[1]} for r in results]


@router.get("/shipments-by-provider")
def get_shipments_by_provider(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    results = (
        db.query(
            LogisticsProvider.name,
            func.count(ShipmentTracking.tracking_id).label("shipment_count"),
        )
        .join(
            ShipmentTracking,
            LogisticsProvider.provider_id == ShipmentTracking.provider_id,
        )
        .group_by(LogisticsProvider.provider_id, LogisticsProvider.name)
        .all()
    )

    return [{"provider": r[0], "count": r[1]} for r in results]


@router.get("/products-by-supplier")
def get_products_by_supplier(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    results = (
        db.query(Supplier.name, func.count(Product.product_id).label("product_count"))
        .join(Product, Supplier.supplier_id == Product.supplier_id)
        .group_by(Supplier.supplier_id, Supplier.name)
        .order_by(func.count(Product.product_id).desc())
        .all()
    )

    return [{"supplier": r[0], "count": r[1]} for r in results]
