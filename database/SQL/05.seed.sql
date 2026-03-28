BEGIN;

-- 1. Insertar categorías (name en mayúsculas)
INSERT INTO categories (name, description, active) VALUES
('ELECTRÓNICOS', 'Productos electrónicos y tecnología', true),
('ROPA', 'Prendas de vestir para hombre y mujer', true),
('HOGAR', 'Artículos para el hogar', true),
('DEPORTES', 'Equipamiento deportivo', true),
('LIBROS', 'Libros y material educativo', true);

INSERT INTO products (id_category, name, sku, price, stock_current, stock_min, stock_max, active) VALUES
(1, 'LAPTOP HP PAVILION', 'LAP-HP-001', 850.00, 15, 5, 50, true),
(1, 'SMARTPHONE SAMSUNG GALAXY', 'SMS-SAM-001', 650.00, 25, 10, 100, true),
(1, 'TABLET IPAD AIR', 'TAB-APP-001', 599.00, 8, 3, 30, true),
(2, 'CAMISETA NIKE', 'CAM-NIK-001', 29.99, 100, 20, 200, true),
(2, 'JEANS LEVI''S', 'JEA-LEV-001', 79.99, 50, 15, 150, true),
(3, 'JUEGO DE SÁBANAS', 'HOG-SAB-001', 45.00, 30, 5, 80, true),
(3, 'OLLA DE PRESIÓN', 'HOG-OLP-001', 89.99, 12, 3, 40, true),
(4, 'BALÓN DE FÚTBOL', 'DEP-BAL-001', 25.00, 45, 10, 100, true),
(4, 'RAQUETA DE TENIS', 'DEP-RAQ-001', 120.00, 8, 2, 25, true),
(5, 'CIEN AÑOS DE SOLEDAD', 'LIB-GGM-001', 15.99, 60, 10, 150, true);

INSERT INTO customers (first_name, last_name, ci, email, phone, active) VALUES
('JUAN', 'PÉREZ', 'V-12345678', 'juan.perez@email.com', '0412-1234567', true),
('MARÍA', 'GONZÁLEZ', 'V-87654321', 'maria.gonzalez@email.com', '0416-7654321', true),
('CARLOS', 'RODRÍGUEZ', 'E-98765432', 'carlos.rodriguez@email.com', '0424-9876543', true),
('ANA', 'MARTÍNEZ', 'V-45678912', 'ana.martinez@email.com', '0414-4567891', true),
('LUIS', 'SÁNCHEZ', 'V-78912345', 'luis.sanchez@email.com', '0426-7891234', true);

INSERT INTO payment_methods (name, active) VALUES
('EFECTIVO', true),
('TARJETA DE DÉBITO', true),
('TARJETA DE CRÉDITO', true),
('TRANSFERENCIA BANCARIA', true),
('PAGO MÓVIL', true);

INSERT INTO suppliers (rif, company_name, contact_name, email, phone, address, active) VALUES
('J-12345678-0', 'TECNOIMPORT C.A.', 'ROBERTO MÉNDEZ', 'ventas@tecnoimport.com', '0212-1234567', 'Av. Principal, Centro Comercial Plaza, Local 5, Caracas', true),
('J-87654321-0', 'MODAEXPRESS S.A.', 'PATRICIA LÓPEZ', 'contacto@modaexpress.com', '0241-8765432', 'Calle 10, Edificio Moda, Piso 2, Valencia', true),
('J-45678912-0', 'HOGARTOTAL C.A.', 'FERNANDO DÍAZ', 'ventas@hogartotal.com', '0261-4567891', 'Av. Libertador, Centro Hogar, Maracaibo', true),
('J-78912345-0', 'DISTRIBUIDORA DEPORTIVA', 'ANDRÉS CASTILLO', 'pedidos@distrideportiva.com', '0286-7891234', 'Calle Comercio, Local Deportes, Barcelona', true),
('J-98765432-0', 'LIBRERÍA UNIVERSAL', 'ELENA RIVAS', 'libreria@universal.com', '0212-9876543', 'Av. Universidad, Centro Cultural, Caracas', true);

INSERT INTO modules (name, active) VALUES
('USUARIOS', true),
('ROLES', true),
('PRODUCTOS', true),
('VENTAS', true),
('COMPRAS', true),
('CLIENTES', true),
('PROVEEDORES', true),
('REPORTES', true),
('CONFIGURACIÓN', true);

INSERT INTO roles (name, active) VALUES
('ADMINISTRADOR', true),
('GERENTE', true),
('VENDEDOR', true),
('ALMACENERO', true),
('CONTADOR', true);

-- Insertar ventas
INSERT INTO sales (id_customer, id_payment_method, total_amount, sale_date, invoice_number, sale_status) VALUES
(1, 2, 929.99, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0001', 'PAID'),
(2, 3, 79.99,  NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0002', 'PAID'),
(3, 1, 179.98, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0003', 'PAID'),
(4, 4, 650.00, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0004', 'PAID'),
(5, 5, 45.00,  NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0005', 'PENDING'),
(1, 2, 120.00, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0006', 'PAID'),
(2, 3, 255.98, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0007', 'CANCELLED'),
(3, 1, 29.99,  NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0008', 'PAID'),
(4, 2, 850.00, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0009', 'PAID'),
(5, 3, 599.00, NOW(), 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-0010', 'PAID');

-- Insertar items de venta
INSERT INTO sales_items (id_sale, id_product, quantity, unit_price, subtotal) VALUES
-- Venta 1: Cliente Juan Pérez
(1, 1, 1, 850.00, 850.00),
(1, 4, 1, 29.99, 29.99),
(1, 10, 1, 15.99, 15.99),
-- Venta 2: Cliente María González
(2, 5, 1, 79.99, 79.99),
-- Venta 3: Cliente Carlos Rodríguez
(3, 6, 2, 45.00, 90.00),
(3, 9, 1, 120.00, 120.00),
-- Venta 4: Cliente Ana Martínez
(4, 2, 1, 650.00, 650.00),
-- Venta 5: Cliente Luis Sánchez
(5, 7, 1, 89.99, 89.99),
-- Venta 6: Cliente Juan Pérez
(6, 9, 1, 120.00, 120.00),
-- Venta 7: Cliente María González (CANCELLED)
(7, 2, 1, 650.00, 650.00),
(7, 3, 1, 599.00, 599.00),
-- Venta 8: Cliente Carlos Rodríguez
(8, 4, 1, 29.99, 29.99),
-- Venta 9: Cliente Ana Martínez
(9, 1, 1, 850.00, 850.00),
-- Venta 10: Cliente Luis Sánchez
(10, 3, 1, 599.00, 599.00);

-- Insertar compras
INSERT INTO purchases (id_payment_method, id_supplier, total_amount, purchase_date, sale_purchase_status, invoice_number) VALUES
(4, 1, 3500.00, NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0001'),
(4, 2, 2800.00, NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0002'),
(5, 3, 1050.00, NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0003'),
(4, 4, 1300.00, NOW(), 'PENDING', 'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0004'),
(5, 5, 480.00,  NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0005'),
(4, 1, 4500.00, NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0006'),
(4, 2, 2200.00, NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0007'),
(5, 3, 890.00,  NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0008'),
(4, 4, 1800.00, NOW(), 'PAID',    'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0009'),
(4, 5, 950.00,  NOW(), 'PENDING', 'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-0010');
-- Insertar items de compra
INSERT INTO purchases_items (id_purchase, id_product, quantity, cost_price, subtotal) VALUES
-- Compra 1: TecnoImport (Laptops y Smartphones)
(1, 1, 5, 700.00, 3500.00),
-- Compra 2: ModaExpress (Camisetas y Jeans)
(2, 4, 50, 20.00, 1000.00),
(2, 5, 30, 60.00, 1800.00),
-- Compra 3: HogarTotal (Sábanas y Ollas)
(3, 6, 20, 35.00, 700.00),
(3, 7, 5, 70.00, 350.00),
-- Compra 4: Distribuidora Deportiva (Balones y Raquetas)
(4, 8, 30, 18.00, 540.00),
(4, 9, 8, 95.00, 760.00),
-- Compra 5: Librería Universal (Libros)
(5, 10, 40, 12.00, 480.00),
-- Compra 6: TecnoImport (Laptops, Smartphones y Tablets)
(6, 1, 8, 680.00, 5440.00),
(6, 2, 12, 530.00, 6360.00),
(6, 3, 5, 480.00, 2400.00),
-- Compra 7: ModaExpress (Más Camisetas y Jeans)
(7, 4, 40, 19.50, 780.00),
(7, 5, 25, 58.00, 1450.00),
-- Compra 8: HogarTotal (Más Sábanas y Ollas)
(8, 6, 15, 34.00, 510.00),
(8, 7, 5, 76.00, 380.00),
-- Compra 9: Distribuidora Deportiva (Balones)
(9, 8, 50, 17.50, 875.00),
(9, 9, 10, 92.50, 925.00),
-- Compra 10: Librería Universal (Más Libros)
(10, 10, 75, 12.50, 937.50);

COMMIT;