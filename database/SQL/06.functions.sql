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