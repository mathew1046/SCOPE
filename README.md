# LogiTrack - Supply Chain Management System

A complete supply chain management system with role-based access control built with FastAPI,React, and PostgreSQL.

## Architecture

- **Backend**: Python FastAPI with SQLAlchemy ORM
- **Frontend**: React with Vite and Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT-based with role permissions

## Features

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Admin** | Full access to all tables and operations |
| **Supply Chain Manager** | Manage suppliers, products, warehouses, inventory; view orders/shipments |
| **Sales Manager** | Manage orders and order items; view customers/shipments |
| **Warehouse Manager** | Manage inventory, warehouses, shipments; view orders/tracking |
| **Logistics Coordinator** | Manage logistics providers and shipment tracking; view shipments |
| **Customer Support** | View and update customer details; view orders/shipments/tracking |

### Modules

- **Suppliers**: Manage supplier information
- **Products**: Product catalog with supplier linkage
- **Warehouses**: Warehouse locations and capacities
- **Inventory**: Stock levels at each warehouse
- **Customers**: Customer information management
- **Orders**: Order processing and tracking
- **Shipments**: Shipment management
- **Logistics Providers**: Transport/logistics partner management
- **Shipment Tracking**: Real-time shipment tracking

## Quick Start

### Prerequisites

- Docker and Docker Compose installed

### Run the Application

```bash
docker-compose up --build
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:18000
- **API Documentation**: http://localhost:18000/docs

### Default User Accounts

All accounts use password: `password`

| Username | Role |
|----------|------|
| admin | Admin |
| supply_manager | Supply Chain Manager |
| sales_manager | Sales Manager |
| warehouse_manager | Warehouse Manager |
| logistics_coord | Logistics Coordinator |
| support | Customer Support |

## Development

### Project Structure

```
LogiTrack/
├── backend/
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   ├── auth.py        # Authentication & authorization
│   │   ├── database.py    # Database connection
│   │   ├── main.py        # FastAPI application
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── schemas.py     # Pydantic schemas
│   │   └── seed_db.py     # Database seeding script
│   ├── Dockerfile
│   ├── requirements.txt
│   └── start.sh           # Startup script
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql           # Database initialization
└── docker-compose.yml
```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Warehouses
- `GET /api/warehouses` - List warehouses
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/{id}` - Update warehouse
- `DELETE /api/warehouses/{id}` - Delete warehouse

### Inventory
- `GET /api/inventory` - List inventory
- `POST /api/inventory` - Create inventory record
- `PUT /api/inventory/{id}` - Update inventory
- `DELETE /api/inventory/{id}` - Delete inventory

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Shipments
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/{id}` - Update shipment
- `DELETE /api/shipments/{id}` - Delete shipment

### Logistics Providers
- `GET /api/logistics` - List providers
- `POST /api/logistics` - Create provider
- `PUT /api/logistics/{id}` - Update provider
- `DELETE /api/logistics/{id}` - Delete provider

### Shipment Tracking
- `GET /api/tracking` - List tracking records
- `POST /api/tracking` - Create tracking
- `PUT /api/tracking/{id}` - Update tracking
- `DELETE /api/tracking/{id}` - Delete tracking

## Database Schema

See `database/init.sql` for complete schema definition.

## License

MIT License