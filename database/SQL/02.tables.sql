-- Tabla: categories
CREATE TABLE categories (
    id_category SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- EN MAYUSCULAS
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tabla: products
CREATE TABLE products (
    id_product SERIAL PRIMARY KEY,
    id_category INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE, -- EN MAYUSCULAS
    sku VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    stock_current INT NOT NULL,
    stock_min INT NOT NULL,
    stock_max INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tabla: customers
CREATE TABLE customers (
    id_customer SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL, -- EN MAYUSCULAS
    last_name VARCHAR(100) NOT NULL, -- EN MAYUSCULAS
    ci VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tabla: payment_methods
CREATE TABLE payment_methods (
    id_payment_method SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- EN MAYUSCULAS
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tabla: configurations
CREATE TABLE configurations (
    id_config SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'general',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tabla: suppliers
CREATE TABLE suppliers (
    id_supplier SERIAL PRIMARY KEY,
    rif VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL, -- EN MAYUSCULAS
    contact_name VARCHAR(100) NOT NULL, -- EN MAYUSCULAS
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Tabla: sales (SIN active)
CREATE TABLE sales (
    id_sale SERIAL PRIMARY KEY,
    id_customer INT NOT NULL,
    id_payment_method INT NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    sale_date TIMESTAMP DEFAULT NOW(),
    invoice_number TEXT DEFAULT NOW() UNIQUE NOT NULL,
    sale_status sale_purchase_status NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: sales_items (SIN active)
CREATE TABLE sales_items (
    id_sale_items SERIAL PRIMARY KEY,
    id_sale INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: purchases (SIN active)
CREATE TABLE purchases (
    id_purchase SERIAL PRIMARY KEY,
    id_payment_method INT NOT NULL,
    id_supplier INT NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    purchase_status sale_purchase_status NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: purchases_items (SIN active)
CREATE TABLE purchases_items (
    id_purchase_details SERIAL PRIMARY KEY,
    id_purchase INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: modules
CREATE TABLE modules (
	id_module SERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL UNIQUE, -- EN MAYUSCULAS
	active BOOLEAN DEFAULT TRUE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deletedAt TIMESTAMP DEFAULT NULL,
	updatedAt TIMESTAMP DEFAULT NULL
);

-- Table: roles
CREATE TABLE roles (
	id_role SERIAL PRIMARY KEY,
	name VARCHAR(40) UNIQUE NOT NULL UNIQUE, -- EN MAYUSCULAS
	active BOOLEAN DEFAULT TRUE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deletedAt TIMESTAMP DEFAULT NULL,
	updatedAt TIMESTAMP DEFAULT NULL
);

CREATE TABLE permissions(
	id_permission SERIAL PRIMARY KEY,
	moduleId INTEGER REFERENCES modules(id_module) NOT NULL,
	typePermission actions_permissions NOT NULL,
	active BOOLEAN DEFAULT TRUE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deletedAt TIMESTAMP DEFAULT NULL,
	updatedAt TIMESTAMP DEFAULT NULL,
	UNIQUE(moduleId, typePermission)
);

CREATE TABLE roles_permissions(
	id_role_permission SERIAL PRIMARY KEY, 
	id_role INTEGER REFERENCES roles(id_role),
	id_permission INTEGER REFERENCES permissions(id_permission),
	active BOOLEAN DEFAULT TRUE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deletedAt TIMESTAMP DEFAULT NULL,
	updatedAt TIMESTAMP DEFAULT NULL,
	UNIQUE(id_role, id_permission)
);

CREATE TABLE users (
	id_user SERIAL PRIMARY KEY,
	id_role INTEGER REFERENCES roles(id_role) NOT NULL,
	name VARCHAR(100) NOT NULL, -- EN MAYUSCULAS
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,  
	active BOOLEAN DEFAULT TRUE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deletedAt TIMESTAMP DEFAULT NULL,
	updatedAt TIMESTAMP DEFAULT NULL
);