from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


def check_permission(user: User, resource: str, action: str) -> bool:
    permissions = {
        "admin": {
            "suppliers": ["create", "read", "update", "delete"],
            "products": ["create", "read", "update", "delete"],
            "warehouses": ["create", "read", "update", "delete"],
            "inventory": ["create", "read", "update", "delete"],
            "customers": ["create", "read", "update", "delete"],
            "orders": ["create", "read", "update", "delete"],
            "order_items": ["create", "read", "update", "delete"],
            "shipments": ["create", "read", "update", "delete"],
            "logistics_providers": ["create", "read", "update", "delete"],
            "shipment_tracking": ["create", "read", "update", "delete"],
            "users": ["create", "read", "update", "delete"],
        },
        "supply_chain_manager": {
            "suppliers": ["create", "read", "update", "delete"],
            "products": ["create", "read", "update", "delete"],
            "warehouses": ["create", "read", "update", "delete"],
            "inventory": ["create", "read", "update", "delete"],
            "orders": ["read"],
            "order_items": ["read"],
            "shipments": ["read"],
            "shipment_tracking": ["read"],
        },
        "sales_manager": {
            "orders": ["create", "read", "update"],
            "order_items": ["create", "read", "update"],
            "customers": ["read"],
            "shipments": ["read"],
            "shipment_tracking": ["read"],
        },
        "warehouse_manager": {
            "inventory": ["create", "read", "update"],
            "warehouses": ["create", "read", "update"],
            "shipments": ["create", "read", "update"],
            "orders": ["read"],
            "order_items": ["read"],
            "shipment_tracking": ["read"],
        },
        "logistics_coordinator": {
            "logistics_providers": ["create", "read", "update", "delete"],
            "shipment_tracking": ["create", "read", "update", "delete"],
            "shipments": ["read"],
        },
        "customer_support": {
            "customers": ["read", "update"],
            "products": ["read"],
            "orders": ["read"],
            "order_items": ["read"],
            "shipments": ["read"],
            "shipment_tracking": ["read"],
        },
    }
    user_permissions = permissions.get(user.role, {})
    resource_permissions = user_permissions.get(resource, [])
    return action in resource_permissions


def require_permission(resource: str, action: str):
    def permission_checker(current_user: User = Depends(get_current_user)):
        if not check_permission(current_user, resource, action):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You don't have permission to {action} {resource}",
            )
        return current_user

    return permission_checker
