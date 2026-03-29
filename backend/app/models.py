from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DECIMAL,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="customer_support")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


class Supplier(Base):
    __tablename__ = "suppliers"
    supplier_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    contact_name = Column(String(255))
    contact_email = Column(String(255), unique=True)
    phone = Column(String(50))
    address = Column(String(500))
    country = Column(String(100))
    products = relationship("Product", back_populates="supplier")


class Product(Base):
    __tablename__ = "products"
    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.supplier_id"))
    stock_quantity = Column(Integer, default=0)
    supplier = relationship("Supplier", back_populates="products")


class Warehouse(Base):
    __tablename__ = "warehouses"
    warehouse_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(500))
    capacity = Column(Integer)


class Inventory(Base):
    __tablename__ = "inventory"
    inventory_id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.warehouse_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer, default=0)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
    warehouse = relationship("Warehouse")
    product = relationship("Product")


class Customer(Base):
    __tablename__ = "customers"
    customer_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    contact_email = Column(String(255), unique=True)
    phone = Column(String(50))
    address = Column(String(500))
    country = Column(String(100))
    orders = relationship("Order", back_populates="customer")


class Order(Base):
    __tablename__ = "orders"
    order_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    order_date = Column(DateTime, server_default=func.now())
    status = Column(String(50), default="pending")
    total_amount = Column(DECIMAL(10, 2))
    customer = relationship("Customer", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    shipments = relationship("Shipment", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product")


class Shipment(Base):
    __tablename__ = "shipments"
    shipment_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"))
    warehouse_id = Column(Integer, ForeignKey("warehouses.warehouse_id"))
    shipped_date = Column(DateTime)
    delivery_date = Column(DateTime)
    status = Column(String(50), default="pending")
    order = relationship("Order", back_populates="shipments")
    warehouse = relationship("Warehouse")
    tracking = relationship("ShipmentTracking", back_populates="shipment")


class LogisticsProvider(Base):
    __tablename__ = "logistics_providers"
    provider_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    contact_name = Column(String(255))
    contact_email = Column(String(255), unique=True)
    phone = Column(String(50))
    service_type = Column(String(100))
    trackings = relationship("ShipmentTracking", back_populates="provider")


class ShipmentTracking(Base):
    __tablename__ = "shipment_tracking"
    tracking_id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.shipment_id"))
    provider_id = Column(Integer, ForeignKey("logistics_providers.provider_id"))
    tracking_number = Column(String(100), unique=True)
    status = Column(String(50))
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    shipment = relationship("Shipment", back_populates="tracking")
    provider = relationship("LogisticsProvider", back_populates="trackings")
