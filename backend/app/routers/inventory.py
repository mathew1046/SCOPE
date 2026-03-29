from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Inventory
from ..schemas import InventoryCreate, InventoryResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[InventoryResponse])
def get_inventory(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Inventory).offset(skip).limit(limit).all()


@router.get("/{inventory_id}", response_model=InventoryResponse)
def get_inventory_item(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    inventory = (
        db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first()
    )
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return inventory


@router.post("", response_model=InventoryResponse)
def create_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_inventory = Inventory(**inventory.dict())
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory


@router.put("/{inventory_id}", response_model=InventoryResponse)
def update_inventory(
    inventory_id: int,
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_inventory = (
        db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first()
    )
    if not db_inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    for key, value in inventory.dict().items():
        setattr(db_inventory, key, value)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory


@router.delete("/{inventory_id}")
def delete_inventory(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    inventory = (
        db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first()
    )
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    db.delete(inventory)
    db.commit()
    return {"message": "Inventory item deleted successfully"}
