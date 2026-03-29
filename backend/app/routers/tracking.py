from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import ShipmentTracking
from ..schemas import ShipmentTrackingCreate, ShipmentTrackingResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[ShipmentTrackingResponse])
def get_trackings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(ShipmentTracking).offset(skip).limit(limit).all()


@router.get("/{tracking_id}", response_model=ShipmentTrackingResponse)
def get_tracking(
    tracking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    tracking = (
        db.query(ShipmentTracking)
        .filter(ShipmentTracking.tracking_id == tracking_id)
        .first()
    )
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    return tracking


@router.post("", response_model=ShipmentTrackingResponse)
def create_tracking(
    tracking: ShipmentTrackingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_tracking = ShipmentTracking(**tracking.dict())
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    return db_tracking


@router.put("/{tracking_id}", response_model=ShipmentTrackingResponse)
def update_tracking(
    tracking_id: int,
    tracking: ShipmentTrackingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_tracking = (
        db.query(ShipmentTracking)
        .filter(ShipmentTracking.tracking_id == tracking_id)
        .first()
    )
    if not db_tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    for key, value in tracking.dict().items():
        setattr(db_tracking, key, value)
    db.commit()
    db.refresh(db_tracking)
    return db_tracking


@router.delete("/{tracking_id}")
def delete_tracking(
    tracking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    tracking = (
        db.query(ShipmentTracking)
        .filter(ShipmentTracking.tracking_id == tracking_id)
        .first()
    )
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    db.delete(tracking)
    db.commit()
    return {"message": "Tracking deleted successfully"}
