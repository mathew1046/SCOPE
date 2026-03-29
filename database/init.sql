CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(500),
    country VARCHAR(100)
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    supplier_id INT REFERENCES suppliers(supplier_id),
    stock_quantity INT DEFAULT 0
);

CREATE TABLE warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    capacity INT
);

CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    product_id INT REFERENCES products(product_id),
    quantity INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(500),
    country VARCHAR(100)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2)
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE shipments (
    shipment_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    shipped_date DATETIME,
    delivery_date DATETIME,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE logistics_providers (
    provider_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    service_type VARCHAR(100)
);

CREATE TABLE shipment_tracking (
    tracking_id SERIAL PRIMARY KEY,
    shipment_id INT REFERENCES shipments(shipment_id),
    provider_id INT REFERENCES logistics_providers(provider_id),
    tracking_number VARCHAR(100) UNIQUE,
    status VARCHAR(50),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer_support',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_tracking_shipment ON shipment_tracking(shipment_id);

INSERT INTO suppliers (name, contact_name, contact_email, phone, address, country) VALUES
('Global Tech Supplies', 'John Smith', 'john@globaltech.com', '+1-555-0100', '100 Tech Street, Silicon Valley, CA', 'USA'),
('EuroMaterials GmbH', 'Hans Mueller', 'hans@euromaterials.de', '+49-30-123456', 'Industriestraße 50, Berlin', 'Germany'),
('AsiaSource Ltd', 'Wei Chen', 'wei@asiasource.cn', '+86-21-87654321', '88Commerce Road, Shanghai', 'China'),
('British Components', 'James Wilson', 'james@britishcomp.co.uk', '+44-20-7946-0958', '50Industrial Estate, London', 'UK');

INSERT INTO warehouses (name, location, capacity) VALUES
('Main Distribution Center', 'Chicago, IL, USA', 100000),
('West Coast Hub', 'Los Angeles, CA, USA', 75000),
('East Coast Facility', 'New York, NY, USA', 80000),
('Central Warehouse', 'Dallas, TX, USA', 60000);

INSERT INTO logistics_providers (name, contact_name, contact_email, phone, service_type) VALUES
('FastTrack Logistics', 'Mike Johnson', 'mike@fasttrack.com', '+1-555-0200', 'Express Delivery'),
('SeaRoute Shipping', 'Sarah Lee', 'sarah@searoute.com', '+1-555-0201', 'Ocean Freight'),
('AirExpress Cargo', 'David Brown', 'david@airexpress.com', '+1-555-0202', 'Air Freight'),
('GroundForce Transport', 'Lisa White', 'lisa@groundforce.com', '+1-555-0203', 'Ground Transport');

INSERT INTO products (name, description, unit_price, supplier_id, stock_quantity) VALUES
('Wireless Keyboard', 'Ergonomic wireless keyboard with backlit keys', 79.99, 1400),
('USB-C Hub', '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader', 49.99, 1, 650),
('Monitor Stand', 'Adjustable aluminum monitor stand with storage', 89.99, 2, 200),
('Webcam HD Pro', '1080p webcam with built-in microphone', 129.99, 1, 320),
('Desk Lamp LED', 'Adjustable LED desk lamp with wireless charging base', 59.99, 4, 450),
('Mouse Pad XL', 'Extra large gaming mouse pad with RGB lighting', 34.99, 3, 800),
('Laptop Stand', 'Portable aluminum laptop stand adjustable height', 45.99, 2, 280),
('Cable Management Kit', 'Complete cable organizer with clips and sleeves', 19.99, 4, 1200),
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 149.99, 1, 180),
('Wireless Mouse', 'Ergonomic wireless mouse with programmable buttons', 69.99, 3, 520);

INSERT INTO customers (name, contact_email, phone, address, country) VALUES
('TechCorp Solutions', 'purchasing@techcorp.com', '+1-555-1001', '500 Innovation Drive, San Francisco, CA', 'USA'),
('Office Supplies Ltd', 'orders@officesupplies.uk', '+44-20-1234-5678', '75 Business Park, London', 'UK'),
('Digital Dynamics Inc', 'procurement@digitaldynamics.com', '+1-555-2002', '1200 Tech Boulevard, Austin, TX', 'USA'),
('EuroCommerce GmbH', 'bestellungen@eurocommerce.de', '+49-89-987654', 'Hauptstrasse 42, Munich', 'Germany'),
('Pacific Trading Co', 'sales@pacifictrading.jp', '+81-3-1234-5678', 'Shibuya-ku, Tokyo', 'Japan'),
('Smart Retail Partners', 'inventory@smartretail.com', '+1-555-3003', '2000 Commerce Street, Seattle, WA', 'USA'),
('Global Electronics BV', 'orders@globalelectronics.nl', '+31-20-5551234', 'Amsterdam Business Center, Amsterdam', 'Netherlands'),
('Fast Fashion Group', 'logistics@fastfashion.com', '+1-555-4004', '350 Fashion Avenue, New York, NY', 'USA');

INSERT INTO users (username, email, hashed_password, role, is_active) VALUES
('admin', 'admin@logitrack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhC8XBqBXKJ7IQ9MQZXKGS', 'admin', true),
('warehouse_manager', 'warehouse@logitrack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhC8XBqBXKJ7IQ9MQZXKGS', 'warehouse_manager', true),
('logistics_coordinator', 'logistics@logitrack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhC8XBqBXKJ7IQ9MQZXKGS', 'logistics_coordinator', true),
('customer_support', 'support@logitrack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhC8XBqBXKJ7IQ9MQZXKGS', 'customer_support', true);

INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES
(1, '2026-03-15 09:30:00', 'delivered', 2599.89),
(2, '2026-03-16 14:22:00', 'shipped', 899.95),
(3, '2026-03-17 11:45:00', 'processing', 1299.97),
(4, '2026-03-18 16:00:00', 'pending', 449.98),
(5, '2026-03-19 08:15:00', 'shipped', 1899.91),
(6, '2026-03-20 10:30:00', 'delivered', 699.93),
(7, '2026-03-21 13:45:00', 'processing', 1149.96),
(8, '2026-03-22 15:20:00', 'pending', 329.97),
(1, '2026-03-23 09:00:00', 'pending', 799.92),
(2, '2026-03-24 11:30:00', 'shipped', 549.97);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 10, 79.99),
(1, 2, 15, 49.99),
(1, 3, 8, 89.99),
(2, 4, 5, 129.99),
(2, 5, 10, 59.99),
(3, 6, 20, 34.99),
(3, 7, 15, 45.99),
(4,8, 25, 19.99),
(5, 9, 5, 149.99),
(5, 10, 20, 69.99),
(5, 1, 15, 79.99),
(6, 3, 12, 89.99),
(6, 5, 8, 59.99),
(7, 2, 20, 49.99),
(7, 6, 15, 34.99),
(8, 9, 2, 149.99),
(9, 10, 8, 69.99),
(9, 1, 4, 79.99),
(10, 4, 3, 129.99),
(10, 7, 6, 45.99);

INSERT INTO inventory (warehouse_id, product_id, quantity, last_updated) VALUES
(1, 1, 250, '2026-03-25 10:00:00'),
(1, 2, 180, '2026-03-25 10:00:00'),
(1, 3,95, '2026-03-25 10:00:00'),
(1, 4, 120, '2026-03-25 10:00:00'),
(2, 5, 200, '2026-03-25 10:00:00'),
(2, 6, 350, '2026-03-25 10:00:00'),
(2, 7, 140, '2026-03-25 10:00:00'),
(3, 8, 500, '2026-03-25 10:00:00'),
(3, 9, 85, '2026-03-25 10:00:00'),
(3, 10, 210, '2026-03-25 10:00:00'),
(4, 1, 150, '2026-03-25 10:00:00'),
(4, 3, 105, '2026-03-25 10:00:00'),
(4, 5, 250, '2026-03-25 10:00:00'),
(4, 6, 450, '2026-03-25 10:00:00');

INSERT INTO shipments (order_id, warehouse_id, shipped_date, delivery_date, status) VALUES
(1, 1, '2026-03-16 08:00:00', '2026-03-18 14:30:00', 'delivered'),
(2, 2, '2026-03-17 10:00:00', NULL, 'in_transit'),
(5, 3, '2026-03-20 09:00:00', NULL, 'in_transit'),
(6, 1, '2026-03-21 08:30:00', '2026-03-23 11:00:00', 'delivered'),
(10, 4, '2026-03-25 14:00:00', NULL, 'in_transit');

INSERT INTO shipment_tracking (shipment_id, provider_id, tracking_number, status, updated_at) VALUES
(1, 1, 'FT-2026-001234', 'delivered', '2026-03-18 14:30:00'),
(2, 3, 'AE-2026-567890', 'in_transit', '2026-03-24 09:00:00'),
(3, 1, 'FT-2026-001235', 'in_transit', '2026-03-23 16:00:00'),
(4, 4, 'GF-2026-345678', 'delivered', '2026-03-23 11:00:00'),
(5, 2, 'SR-2026-901234', 'in_transit', '2026-03-25 15:00:00');