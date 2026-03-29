from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import LogisticsProvider
from ..schemas import LogisticsProviderCreate, LogisticsProviderResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[LogisticsProviderResponse])
def get_providers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(LogisticsProvider).offset(skip).limit(limit).all()


@router.get("/{provider_id}", response_model=LogisticsProviderResponse)
def get_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    provider = (
        db.query(LogisticsProvider)
        .filter(LogisticsProvider.provider_id == provider_id)
        .first()
    )
    if not provider:
        raise HTTPException(status_code=404, detail="Logistics provider not found")
    return provider


@router.post("", response_model=LogisticsProviderResponse)
def create_provider(
    provider: LogisticsProviderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_provider = LogisticsProvider(**provider.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider


@router.put("/{provider_id}", response_model=LogisticsProviderResponse)
def update_provider(
    provider_id: int,
    provider: LogisticsProviderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_provider = (
        db.query(LogisticsProvider)
        .filter(LogisticsProvider.provider_id == provider_id)
        .first()
    )
    if not db_provider:
        raise HTTPException(status_code=404, detail="Logistics provider not found")
    for key, value in provider.dict().items():
        setattr(db_provider, key, value)
    db.commit()
    db.refresh(db_provider)
    return db_provider


@router.delete("/{provider_id}")
def delete_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    provider = (
        db.query(LogisticsProvider)
        .filter(LogisticsProvider.provider_id == provider_id)
        .first()
    )
    if not provider:
        raise HTTPException(status_code=404, detail="Logistics provider not found")
    db.delete(provider)
    db.commit()
    return {"message": "Logistics provider deleted successfully"}
