-- View que devuelve los productos con stock minimo
CREATE
OR REPLACE VIEW get_products_min_stock AS
SELECT
    p.name AS name_product,
    c.name AS name_category,
    p.stock_current,
    p.stock_min,
    COUNT(*) OVER () AS total_products_stock_min,
    CASE
        WHEN p.stock_current = 0 THEN 'AGOTADO'
        ELSE 'CRITICO'
    END AS prioridad
FROM
    products p
    INNER JOIN categories c ON p.id_category = c.id_category
WHERE
    stock_current <= stock_min
ORDER BY
    p.stock_current ASC;

-- View que devuelve los productos que no se han vendido en los ultimos 30 dias
CREATE
OR REPLACE VIEW products_without_sales_30days AS
SELECT
    p.id_product,
    p.name AS product_name,
    c.name AS category_name,
    p.stock_current
FROM
    products p
    INNER JOIN categories c ON c.id_category = p.id_category
WHERE
    p.active = TRUE
    AND p.deleted_at IS NULL
    AND p.stock_current > 0
    AND NOT EXISTS (
        SELECT
            1
        FROM
            sales_items si
            INNER JOIN sales s ON s.id_sale = si.id_sale
        WHERE
            si.id_product = p.id_product
            AND s.sale_status = 'PAID'
            AND s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
    )
ORDER BY
    p.stock_current DESC;

-- View que devuelve el inventario de productos con costo y valor de venta
CREATE
OR REPLACE VIEW inventory_summary_cost_vs_sale AS
SELECT
    COUNT(DISTINCT p.id_product) AS total_products_with_stock,
    SUM(p.stock_current) AS total_units,
    SUM(p.stock_current * COALESCE(pi.cost_price, 0)) AS total_inventory_cost,
    SUM(p.stock_current * p.price) AS total_inventory_sale_value,
    SUM(
        (p.stock_current * p.price) - (p.stock_current * COALESCE(pi.cost_price, 0))
    ) AS total_profit_potential
FROM
    products p
    INNER JOIN categories c ON c.id_category = p.id_category
    LEFT JOIN (
        SELECT DISTINCT
            ON (pi.id_product) pi.id_product,
            pi.cost_price
        FROM
            purchases_items pi
            INNER JOIN purchases pu ON pu.id_purchase = pi.id_purchase
        WHERE
            pu.purchase_status = 'PAID'
        ORDER BY
            pi.id_product,
            pu.purchase_date DESC
    ) pi ON pi.id_product = p.id_product
WHERE
    p.active = TRUE
    AND p.deleted_at IS NULL
    AND p.stock_current > 0;