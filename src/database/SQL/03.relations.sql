ALTER TABLE products 
    ADD CONSTRAINT fk_products_category 
    FOREIGN KEY (id_category) REFERENCES categories(id_category);

-- Relación: Ventas -> Clientes
ALTER TABLE sales 
    ADD CONSTRAINT fk_sales_customer 
    FOREIGN KEY (id_customer) REFERENCES customers(id_customer);

-- Relación: Ventas -> Métodos de Pago
ALTER TABLE sales 
    ADD CONSTRAINT fk_sales_payment_method 
    FOREIGN KEY (id_payment_method) REFERENCES payment_methods(id_payment_method);

-- Relación: Compras -> Métodos de Pago
ALTER TABLE purchases 
    ADD CONSTRAINT fk_purchases_payment_method 
    FOREIGN KEY (id_payment_method) REFERENCES payment_methods(id_payment_method);

-- Relación: Compras -> Proveedores
ALTER TABLE purchases 
    ADD CONSTRAINT fk_purchases_supplier 
    FOREIGN KEY (id_supplier) REFERENCES suppliers(id_supplier);

-- Relación: Items de Venta -> Ventas
ALTER TABLE sales_items 
    ADD CONSTRAINT fk_sales_items_sale 
    FOREIGN KEY (id_sale) REFERENCES sales(id_sale);

-- Relación: Items de Venta -> Productos
ALTER TABLE sales_items 
    ADD CONSTRAINT fk_sales_items_product 
    FOREIGN KEY (id_product) REFERENCES products(id_product);

-- Relación: Items de Compra -> Compras
ALTER TABLE purchases_items 
    ADD CONSTRAINT fk_purchases_items_purchase 
    FOREIGN KEY (id_purchase) REFERENCES purchases(id_purchase);

-- Relación: Items de Compra -> Productos
ALTER TABLE purchases_items 
    ADD CONSTRAINT fk_purchases_items_product 
    FOREIGN KEY (id_product) REFERENCES products(id_product);