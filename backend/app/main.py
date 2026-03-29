from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import (
    auth,
    suppliers,
    products,
    warehouses,
    inventory,
    customers,
    orders,
    shipments,
    logistics,
    tracking,
    analytics,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LogiTrack - Supply Chain Management",
    description="API for Supply Chain Management and Optimization",
    version="1.0.0",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["Suppliers"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(warehouses.router, prefix="/api/warehouses", tags=["Warehouses"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(shipments.router, prefix="/api/shipments", tags=["Shipments"])
app.include_router(
    logistics.router, prefix="/api/logistics", tags=["LogisticsProviders"]
)
app.include_router(tracking.router, prefix="/api/tracking", tags=["ShipmentTracking"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/")
def root():
    return {"message": "LogiTrack API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
