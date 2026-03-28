-- View que devuelve los productos con stock minimo
CREATE VIEW get_products_min_stock AS
SELECT 
	p.name AS name_product,
	c.name AS name_category, 
	p.stock_current,
	p.stock_min,
	COUNT(*) OVER() AS total_products_stock_min,
	CASE 
	    WHEN p.stock_current = 0 THEN 'AGOTADO'
	    ELSE 'CRITICO'
	END AS prioridad
FROM products p 
INNER JOIN categories c ON p.id_category = c.id_category
WHERE stock_current <= stock_min
ORDER BY p.stock_current ASC