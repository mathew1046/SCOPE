from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "customer_support"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class SupplierBase(BaseModel):
    name: str
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierResponse(SupplierBase):
    supplier_id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    unit_price: Decimal
    supplier_id: Optional[int] = None
    stock_quantity: int = 0


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    product_id: int

    class Config:
        from_attributes = True


class WarehouseBase(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: Optional[int] = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseResponse(WarehouseBase):
    warehouse_id: int

    class Config:
        from_attributes = True


class InventoryBase(BaseModel):
    warehouse_id: int
    product_id: int
    quantity: int = 0


class InventoryCreate(InventoryBase):
    pass


class InventoryResponse(InventoryBase):
    inventory_id: int
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    name: str
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    customer_id: int

    class Config:
        from_attributes = True


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    order_item_id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_id: int
    status: str = "pending"
    total_amount: Optional[Decimal] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderResponse(OrderBase):
    order_id: int
    order_date: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class ShipmentBase(BaseModel):
    order_id: int
    warehouse_id: int
    status: str = "pending"
    shipped_date: Optional[str] = None
    delivery_date: Optional[str] = None


class ShipmentCreate(ShipmentBase):
    pass


class ShipmentResponse(ShipmentBase):
    shipment_id: int
    shipped_date: Optional[datetime] = None
    delivery_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class LogisticsProviderBase(BaseModel):
    name: str
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    service_type: Optional[str] = None


class LogisticsProviderCreate(LogisticsProviderBase):
    pass


class LogisticsProviderResponse(LogisticsProviderBase):
    provider_id: int

    class Config:
        from_attributes = True


class ShipmentTrackingBase(BaseModel):
    shipment_id: int
    provider_id: int
    tracking_number: str
    status: str


class ShipmentTrackingCreate(ShipmentTrackingBase):
    pass


class ShipmentTrackingResponse(ShipmentTrackingBase):
    tracking_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
