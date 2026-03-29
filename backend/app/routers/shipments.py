from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import Shipment
from ..schemas import ShipmentCreate, ShipmentResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[ShipmentResponse])
def get_shipments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Shipment).offset(skip).limit(limit).all()


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


def parse_date(date_str):
    if date_str:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except (ValueError, TypeError):
            return None
    return None


@router.post("", response_model=ShipmentResponse)
def create_shipment(
    shipment: ShipmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    data = shipment.dict()
    data["shipped_date"] = parse_date(data.get("shipped_date"))
    data["delivery_date"] = parse_date(data.get("delivery_date"))
    db_shipment = Shipment(**data)
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment


@router.put("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(
    shipment_id: int,
    shipment: ShipmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if not db_shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    data = shipment.dict()
    data["shipped_date"] = parse_date(data.get("shipped_date"))
    data["delivery_date"] = parse_date(data.get("delivery_date"))
    for key, value in data.items():
        setattr(db_shipment, key, value)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment


@router.delete("/{shipment_id}")
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    db.delete(shipment)
    db.commit()
    return {"message": "Shipment deleted successfully"}
