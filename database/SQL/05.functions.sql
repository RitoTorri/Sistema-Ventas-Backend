-- Funcion que devuelve el total de ventas realizadas en un rango de fechas
CREATE OR REPLACE FUNCTION get_sales_count_by_date(
    date1 TIMESTAMP, 
    date2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE(sales_count INTEGER) AS $$ 
BEGIN 
    RETURN QUERY
    SELECT COUNT(*)::INTEGER AS sales_count 
    FROM sales 
    WHERE sale_status = 'PAID' 
        AND sale_date::DATE BETWEEN date1::DATE AND date2::DATE;
END;
$$ LANGUAGE plpgsql;

-- Funcion que devuelve el total de compras realizadas en un rango de fechas
CREATE OR REPLACE FUNCTION get_purchases_count_by_date(
    date1 TIMESTAMP, 
    date2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE(purchases_count INTEGER) AS $$ 
BEGIN 
    RETURN QUERY
    SELECT COUNT(*)::INTEGER AS purchases_count 
    FROM purchases 
    WHERE purchase_status = 'PAID' 
        AND purchase_date::DATE BETWEEN date1::DATE AND date2::DATE;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener los 5 productos más vendidos en un rango de fechas
CREATE OR REPLACE FUNCTION get_five_products_more_sales(
    date1 TIMESTAMP, 
    date2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE(
    id_product INTEGER,
    category VARCHAR,
    product_name VARCHAR,
    code_sku VARCHAR,
    price_unit NUMERIC,
    total_items_sale INTEGER
) AS $$
BEGIN 
    RETURN QUERY
    SELECT 
        p.id_product,  
        c.name::VARCHAR AS category,
        p.name::VARCHAR AS product_name,
        p.sku::VARCHAR AS code_sku,
        p.price::NUMERIC AS price_unit,
        SUM(si.quantity)::INTEGER AS total_items_sale
    FROM products p
    INNER JOIN categories c ON c.id_category = p.id_category
    INNER JOIN sales_items si ON si.id_product = p.id_product
    INNER JOIN sales s ON s.id_sale = si.id_sale
    WHERE s.sale_status = 'PAID' 
        AND s.sale_date::DATE BETWEEN date1::DATE AND date2::DATE
    GROUP BY p.id_product, c.name, p.name, p.sku, p.price
    ORDER BY total_items_sale DESC, total_items_sale ASC
    LIMIT 5;
END; 
$$ LANGUAGE plpgsql;

-- Function que devuleve los 5 clientes mas frecuentes en un rango de fechas
CREATE OR REPLACE FUNCTION get_five_customers_most_purchases(
    date1 TIMESTAMP, 
    date2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE(
    first_name VARCHAR,
    last_name VARCHAR,
    total_sales INTEGER,
    total_amount DECIMAL(10,2)
) AS $$
BEGIN 
    RETURN QUERY
    SELECT 
        c.first_name::VARCHAR,
        c.last_name::VARCHAR AS client,
        COUNT(s.id_sale)::INTEGER AS total_sales,
        SUM(s.total_amount)::DECIMAL(10,2) AS total_amount
    FROM customers c 
    INNER JOIN sales s ON s.id_customer = c.id_customer
    WHERE
        s.sale_status = 'PAID'  
        AND s.sale_date::DATE BETWEEN date1::DATE AND date2::DATE
    GROUP BY(c.first_name, c.last_name)
    ORDER BY total_sales DESC LIMIT 10;
END; 
$$ LANGUAGE plpgsql;

-- Funciion que devuelve los 10 proveedores mas frecuentes en un rango de fechas
CREATE OR REPLACE FUNCTION get_top_suppliers(
    date1 TIMESTAMP,
    date2 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE(
    id_supplier INTEGER,
    company_name VARCHAR,
    rif VARCHAR,
    total_purchases INTEGER,
    total_amount DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id_supplier,
        s.company_name,
        s.rif,
        COUNT(p.id_purchase)::INTEGER AS total_purchases,
        SUM(p.total_amount)::DECIMAL(10,2) AS total_amount
    FROM suppliers s
    INNER JOIN purchases p ON p.id_supplier = s.id_supplier
    WHERE 
        p.purchase_status = 'PAID'
        AND p.purchase_date::DATE BETWEEN date1::DATE AND date2::DATE
    GROUP BY s.id_supplier, s.company_name, s.rif
    ORDER BY total_purchases DESC, total_amount DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

