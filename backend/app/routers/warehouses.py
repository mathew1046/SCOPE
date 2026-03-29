from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Warehouse
from ..schemas import WarehouseCreate, WarehouseResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[WarehouseResponse])
def get_warehouses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Warehouse).offset(skip).limit(limit).all()


@router.get("/{warehouse_id}", response_model=WarehouseResponse)
def get_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    warehouse = (
        db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    )
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return warehouse


@router.post("", response_model=WarehouseResponse)
def create_warehouse(
    warehouse: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_warehouse = Warehouse(**warehouse.dict())
    db.add(db_warehouse)
    db.commit()
    db.refresh(db_warehouse)
    return db_warehouse


@router.put("/{warehouse_id}", response_model=WarehouseResponse)
def update_warehouse(
    warehouse_id: int,
    warehouse: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_warehouse = (
        db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    )
    if not db_warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    for key, value in warehouse.dict().items():
        setattr(db_warehouse, key, value)
    db.commit()
    db.refresh(db_warehouse)
    return db_warehouse


@router.delete("/{warehouse_id}")
def delete_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    warehouse = (
        db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
    )
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    db.delete(warehouse)
    db.commit()
    return {"message": "Warehouse deleted successfully"}
