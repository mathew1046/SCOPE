from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Order, OrderItem
from ..schemas import OrderCreate, OrderResponse, OrderItemResponse
from ..auth import get_current_user
from decimal import Decimal

router = APIRouter()


@router.get("", response_model=List[OrderResponse])
def get_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(Order).order_by(Order.order_id.desc()).offset(skip).limit(limit).all()
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    total_amount = sum(item.quantity * item.unit_price for item in order.items)
    db_order = Order(
        customer_id=order.customer_id, status=order.status, total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    status: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    if status:
        db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order


@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}
