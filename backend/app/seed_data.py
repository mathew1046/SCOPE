import sys
import os
from datetime import datetime, timedelta
import random

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import (
    User,
    Supplier,
    Product,
    Warehouse,
    Inventory,
    Customer,
    Order,
    OrderItem,
    Shipment,
    LogisticsProvider,
    ShipmentTracking,
)
from passlib.context import CryptContext
from decimal import Decimal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_all():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Seed Users
        users_data = [
            ("admin", "admin@logitrack.com", "admin", "admin123"),
            (
                "supply_manager",
                "supply@logitrack.com",
                "supply_chain_manager",
                "supply123",
            ),
            ("sales_manager", "sales@logitrack.com", "sales_manager", "sales123"),
            (
                "warehouse_manager",
                "warehouse@logitrack.com",
                "warehouse_manager",
                "warehouse123",
            ),
            (
                "logistics_coord",
                "logistics@logitrack.com",
                "logistics_coordinator",
                "logistics123",
            ),
            ("support", "support@logitrack.com", "customer_support", "support123"),
        ]

        for username, email, role, password in users_data:
            if not db.query(User).filter(User.username == username).first():
                user = User(
                    username=username,
                    email=email,
                    hashed_password=pwd_context.hash(password),
                    role=role,
                    is_active=True,
                )
                db.add(user)
        db.commit()
        print("Users seeded!")

        # Seed Suppliers
        suppliers_data = [
            (
                "TechParts Global",
                "John Smith",
                "john@techparts.com",
                "+1-555-0101",
                "1234 Industrial Blvd, San Jose, CA 95112",
                "USA",
            ),
            (
                "Asia Electronics Co.",
                "Li Wei",
                "liwei@asiaelec.cn",
                "+86-21-5555-0102",
                "456 Tech Park, Shanghai 200001",
                "China",
            ),
            (
                "European Components Ltd",
                "Hans Mueller",
                "hans@eurocomp.de",
                "+49-30-5555-0103",
                "789 Industriestrabe, Berlin 10115",
                "Germany",
            ),
            (
                "Pacific Supply Inc.",
                "Tanaka Yuki",
                "tanaka@pacsupply.jp",
                "+81-3-5555-0104",
                "321 Harbor Road, Tokyo 100-0001",
                "Japan",
            ),
            (
                "American Wholesale",
                "Sarah Johnson",
                "sarah@amwholesale.com",
                "+1-555-0105",
                "555 Commerce Street, Chicago, IL 60601",
                "USA",
            ),
            (
                "Global Materials UK",
                "James Wilson",
                "james@globalmat.co.uk",
                "+44-20-5555-0106",
                "889 Trading Estate, London E1 6AN",
                "UK",
            ),
            (
                "Nordic Supplies AB",
                "Erik Larsson",
                "erik@nordicsup.se",
                "+46-8-5555-0107",
                "1234 Business Center, Stockholm 11122",
                "Sweden",
            ),
            (
                "Benelux Distributors",
                "Pieter van Berg",
                "pieter@beneluxdist.nl",
                "+31-20-5555-0108",
                "567 Logistics Park, Amsterdam 1012",
                "Netherlands",
            ),
        ]

        for name, contact, email, phone, address, country in suppliers_data:
            if not db.query(Supplier).filter(Supplier.contact_email == email).first():
                supplier = Supplier(
                    name=name,
                    contact_name=contact,
                    contact_email=email,
                    phone=phone,
                    address=address,
                    country=country,
                )
                db.add(supplier)
        db.commit()
        print("Suppliers seeded!")

        # Seed Products
        suppliers = db.query(Supplier).all()
        products_data = [
            (
                "Industrial Motor IM-500",
                "Heavy-duty industrial motor, 500W, 220V",
                1299.99,
            ),
            (
                "Circuit Board CB-200",
                "Multi-layer PCB, 200x150mm, RoHS compliant",
                45.50,
            ),
            ("Steel Bearing SB-100", "Precision steel bearing, 100mm diameter", 28.75),
            ("Hydraulic Pump HP-300", "Industrial hydraulic pump, 3000 PSI", 849.00),
            ("Sensor Array SA-50", "Multi-axis sensor array, 50 channels", 325.00),
            ("Control Module CM-800", "PLC control module, 800 I/O points", 1875.00),
            ("Power Supply PS-1500", "Industrial PSU, 1500W, 24V DC output", 425.00),
            (
                "Pneumatic Valve PV-200",
                "Solenoid pneumatic valve, 200 PSI rating",
                156.50,
            ),
            ("Gearbox Assembly GA-400", "Industrial gearbox, 400:1 ratio", 685.00),
            (
                "Thermal Sensor TS-100",
                "High-precision thermal sensor, -50 to 500C",
                89.99,
            ),
            ("Servo Motor SM-750", "AC servo motor, 750W, with encoder", 1420.00),
            ("Stainless Pipe SP-200", "SS304 seamless pipe, 200mm x 6m", 195.00),
            ("Aluminum Frame AF-100", "Industrial aluminum profile, 100x100mm", 78.50),
            ("LED Panel LP-600", "Industrial LED panel, 600x600mm, IP65", 145.00),
            ("Conveyor Belt CB-1000", "Modular conveyor belt, 1000mm width", 520.00),
            ("Safety Switch SS-50", "Emergency stop switch, IP67 rated", 62.00),
            (
                "Cable Assembly CA-25",
                "Industrial cable harness, 25-pin connector",
                38.00,
            ),
            ("Display Panel DP-15", "HMI touch display, 15 inch, IP65", 580.00),
            ("Actuator Cylinder AC-500", "Pneumatic cylinder, 500mm stroke", 285.00),
            ("Filter Housing FH-300", "Stainless filter housing, 300 GPM", 165.00),
        ]

        for i, (name, desc, price) in enumerate(products_data):
            supplier = suppliers[i % len(suppliers)]
            if not db.query(Product).filter(Product.name == name).first():
                product = Product(
                    name=name,
                    description=desc,
                    unit_price=Decimal(str(price)),
                    supplier_id=supplier.supplier_id,
                    stock_quantity=random.randint(50, 500),
                )
                db.add(product)
        db.commit()
        print("Products seeded!")

        # Seed Warehouses
        warehouses_data = [
            (
                "West Coast Distribution Center",
                "4500 Harbor Blvd, Los Angeles, CA 90001",
                50000,
            ),
            ("Central Hub Warehouse", "1200 Logistics Way, Dallas, TX 75201", 75000),
            ("East Coast Fulfillment", "8000 Industrial Ave, Newark, NJ 07102", 60000),
            ("Midwest Storage Facility", "3500 Depot Street, Chicago, IL 60601", 45000),
            (
                "Southern Distribution Center",
                "2200 Commerce Road, Atlanta, GA 30301",
                55000,
            ),
        ]

        for name, location, capacity in warehouses_data:
            if not db.query(Warehouse).filter(Warehouse.name == name).first():
                warehouse = Warehouse(name=name, location=location, capacity=capacity)
                db.add(warehouse)
        db.commit()
        print("Warehouses seeded!")

        # Seed Inventory
        warehouses = db.query(Warehouse).all()
        products = db.query(Product).all()

        for warehouse in warehouses:
            for product in products[:10]:  # First 10 products per warehouse
                existing = (
                    db.query(Inventory)
                    .filter(
                        Inventory.warehouse_id == warehouse.warehouse_id,
                        Inventory.product_id == product.product_id,
                    )
                    .first()
                )
                if not existing:
                    inv = Inventory(
                        warehouse_id=warehouse.warehouse_id,
                        product_id=product.product_id,
                        quantity=random.randint(10, 200),
                    )
                    db.add(inv)
        db.commit()
        print("Inventory seeded!")

        # Seed Customers
        customers_data = [
            (
                "Manufacturing Solutions Inc.",
                "orders@mansol.com",
                "+1-555-0201",
                "1000 Factory Lane, Detroit, MI 48201",
                "USA",
            ),
            (
                "Auto Parts Direct",
                "purchasing@autopartsdirect.com",
                "+1-555-0202",
                "2500 Assembly Road, Toledo, OH 43601",
                "USA",
            ),
            (
                "Global Machinery Corp",
                "supply@globalmachinery.com",
                "+44-20-5555-0203",
                "500 Engineering Way, Birmingham B1 1AA",
                "UK",
            ),
            (
                "Precision Tools Ltd",
                "orders@precisiontools.co.uk",
                "+44-161-555-0204",
                "350 Workshop Street, Manchester M1 1AA",
                "UK",
            ),
            (
                "Nordic Manufacturing AB",
                "supply@nordicmfg.se",
                "+46-8-5555-0205",
                "750 Industrial Park, Gothenburg 40010",
                "Sweden",
            ),
            (
                "Bertrand Industries",
                "achats@bertrand.fr",
                "+33-1-5555-0206",
                "125 Rue Industrielle, Paris 75001",
                "France",
            ),
            (
                "TechBuild GmbH",
                "bestellung@techbuild.de",
                "+49-89-5555-0207",
                "800 Technik Strasse, Munich 80331",
                "Germany",
            ),
            (
                "Iberian Supplies SL",
                "compras@iberian.es",
                "+34-91-5555-0208",
                "450 Calle Industrial, Madrid 28001",
                "Spain",
            ),
            (
                "Italian Components Srl",
                "ordini@italcomp.it",
                "+39-02-5555-0209",
                "300 Via Fabbrica, Milan 20121",
                "Italy",
            ),
            (
                "Eastern Manufacturing",
                "orders@easternmfg.com",
                "+1-555-0210",
                "1500 Production Ave, Cleveland, OH 44101",
                "USA",
            ),
            (
                "Pacific Industrial Co.",
                "purchasing@pacind.com",
                "+1-555-0211",
                "2000 Tech Boulevard, Seattle, WA 98101",
                "USA",
            ),
            (
                "Canadian Parts Ltd",
                "orders@canparts.ca",
                "+1-416-555-0212",
                "600 Commerce Drive, Toronto M5V 1A1",
                "Canada",
            ),
        ]

        for name, email, phone, address, country in customers_data:
            if not db.query(Customer).filter(Customer.contact_email == email).first():
                customer = Customer(
                    name=name,
                    contact_email=email,
                    phone=phone,
                    address=address,
                    country=country,
                )
                db.add(customer)
        db.commit()
        print("Customers seeded!")

        # Seed Orders and Order Items
        customers = db.query(Customer).all()
        products_list = db.query(Product).all()
        order_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

        for i in range(25):
            customer = random.choice(customers)
            num_items = random.randint(2, 5)
            order_products = random.sample(products_list, num_items)
            total_amount = 0

            base_date = datetime.now() - timedelta(days=random.randint(1, 60))
            order = Order(
                customer_id=customer.customer_id,
                order_date=base_date,
                status=random.choice(order_statuses[:4]),
                total_amount=Decimal("0"),
            )
            db.add(order)
            db.flush()  # Get order_id

            for product in order_products:
                quantity = random.randint(1, 10)
                unit_price = product.unit_price
                total_amount += quantity * float(unit_price)

                order_item = OrderItem(
                    order_id=order.order_id,
                    product_id=product.product_id,
                    quantity=quantity,
                    unit_price=unit_price,
                )
                db.add(order_item)

            order.total_amount = Decimal(str(round(total_amount, 2)))

        db.commit()
        print("Orders seeded!")

        # Seed Logistics Providers
        logistics_data = [
            (
                "DHL Express",
                "Carlos Rodriguez",
                "business@dhl.com",
                "+1-800-225-5345",
                "Express",
            ),
            (
                "FedEx Logistics",
                "Michelle Thompson",
                "logistics@fedex.com",
                "+1-800-463-3339",
                "Express",
            ),
            (
                "UPS Supply Chain",
                "Robert Chen",
                "supplychain@ups.com",
                "+1-800-742-5877",
                "Ground",
            ),
            (
                "Maersk Line",
                "Anders Nielsen",
                "shipping@maersk.com",
                "+45-33-63-33-63",
                "Ocean Freight",
            ),
            (
                "Kuehne + Nagel",
                "Thomas Bauer",
                "seafreight@kuehne-nagel.com",
                "+41-44-828-1111",
                "Sea Freight",
            ),
            (
                "DB Schenker",
                "Klaus Schmidt",
                "landtransport@dbschenker.com",
                "+49-30-233-0",
                "Rail & Road",
            ),
            (
                "Nippon Express",
                "Yamamoto Kenji",
                "global@nipponexpress.jp",
                "+81-3-5555-8111",
                "Air Freight",
            ),
            (
                "XPO Logistics",
                "Jennifer Martinez",
                "freight@xpo.com",
                "+1-844-742-5976",
                "Truckload",
            ),
        ]

        for name, contact, email, phone, service_type in logistics_data:
            if (
                not db.query(LogisticsProvider)
                .filter(LogisticsProvider.contact_email == email)
                .first()
            ):
                provider = LogisticsProvider(
                    name=name,
                    contact_name=contact,
                    contact_email=email,
                    phone=phone,
                    service_type=service_type,
                )
                db.add(provider)
        db.commit()
        print("Logistics providers seeded!")

        # Seed Shipments and Tracking
        orders = (
            db.query(Order).filter(Order.status.in_(["shipped", "delivered"])).all()
        )
        warehouses_list = db.query(Warehouse).all()
        providers = db.query(LogisticsProvider).all()
        statuses = [
            "in_transit",
            "out_for_delivery",
            "delivered",
            "customs_clearance",
            "at_origin",
        ]

        for order in orders:
            warehouse = random.choice(warehouses_list)
            shipped_date = order.order_date + timedelta(days=random.randint(1, 3))
            delivery_date = (
                shipped_date + timedelta(days=random.randint(3, 14))
                if order.status == "delivered"
                else None
            )

            shipment = Shipment(
                order_id=order.order_id,
                warehouse_id=warehouse.warehouse_id,
                shipped_date=shipped_date,
                delivery_date=delivery_date,
                status=order.status,
            )
            db.add(shipment)
            db.flush()

            # Add tracking
            tracking_num = f"TRK{random.randint(100000000, 999999999)}"
            provider = random.choice(providers)

            tracking = ShipmentTracking(
                shipment_id=shipment.shipment_id,
                provider_id=provider.provider_id,
                tracking_number=tracking_num,
                status=random.choice(statuses[:3]),
            )
            db.add(tracking)

        db.commit()
        print("Shipments and tracking seeded!")

        print("\n=== All data seeded successfully! ===")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
