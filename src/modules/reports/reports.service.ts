import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // 1. Productos con stock mínimo
  async getProductsMinStock() {
    return await this.dataSource.query(`
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
                p.stock_current ASC
        `);
  }

  // 2. Productos sin ventas en 30 días
  async getProductsWithoutSales30Days() {
    return await this.dataSource.query(`
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
                p.stock_current DESC
        `);
  }

  // 3. Resumen inventario (costo vs venta)
  async getInventorySummaryCostVsSale() {
    return await this.dataSource.query(`
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
                AND p.stock_current > 0
        `);
  }

  /**
   * Total de ventas en un rango de fechas
   */
  async getSalesCountByDate(date1: string, date2: string) {
    const result = await this.dataSource.query(
      `SELECT COUNT(*)::INTEGER AS sales_count 
             FROM sales 
             WHERE sale_status = 'PAID' 
                 AND sale_date::DATE BETWEEN $1::DATE AND $2::DATE`,
      [date1, date2],
    );
    return {
      sales_count: result[0]?.sales_count || 0,
      date_range: {
        from: date1,
        to: date2,
      },
    };
  }

  /**
   * Total de compras en un rango de fechas
   */
  async getPurchasesCountByDate(date1: string, date2: string) {
    const result = await this.dataSource.query(
      `SELECT COUNT(*)::INTEGER AS purchases_count 
             FROM purchases 
             WHERE purchase_status = 'PAID' 
                 AND purchase_date::DATE BETWEEN $1::DATE AND $2::DATE`,
      [date1, date2],
    );
    return {
      purchases_count: result[0]?.purchases_count || 0,
      date_range: {
        from: date1,
        to: date2,
      },
    };
  }

  /**
   * Top 5 productos más vendidos en un rango de fechas
   */
  async getFiveProductsMoreSales(date1: string, date2: string) {
    const results = await this.dataSource.query(
      `SELECT 
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
                AND s.sale_date::DATE BETWEEN $1::DATE AND $2::DATE
            GROUP BY p.id_product, c.name, p.name, p.sku, p.price
            ORDER BY total_items_sale DESC, total_items_sale ASC
            LIMIT 5`,
      [date1, date2],
    );
    return {
      data: results,
      total_products: results.length,
      date_range: {
        from: date1,
        to: date2,
      },
    };
  }

  /**
   * Top 5 clientes con más compras en un rango de fechas
   */
  async getFiveCustomersMostPurchases(date1: string, date2: string) {
    const results = await this.dataSource.query(
      `SELECT 
                c.first_name::VARCHAR,
                c.last_name::VARCHAR AS client,
                COUNT(s.id_sale)::INTEGER AS total_sales,
                SUM(s.total_amount)::DECIMAL(10,2) AS total_amount
            FROM customers c 
            INNER JOIN sales s ON s.id_customer = c.id_customer
            WHERE
                s.sale_status = 'PAID'  
                AND s.sale_date::DATE BETWEEN $1::DATE AND $2::DATE
            GROUP BY(c.first_name, c.last_name)
            ORDER BY total_sales DESC LIMIT 10`,
      [date1, date2],
    );
    return {
      data: results,
      total_customers: results.length,
      date_range: {
        from: date1,
        to: date2,
      },
    };
  }

  /**
   * Top 10 proveedores más frecuentes en un rango de fechas
   */
  async getTopSuppliers(date1: string, date2: string) {
    console.log(date2);
    const results = await this.dataSource.query(
      `SELECT 
                s.id_supplier,
                s.company_name,
                s.rif,
                COUNT(p.id_purchase)::INTEGER AS total_purchases,
                SUM(p.total_amount)::DECIMAL(10,2) AS total_amount
            FROM suppliers s
            INNER JOIN purchases p ON p.id_supplier = s.id_supplier
            WHERE 
                p.purchase_status = 'PAID'
                AND p.purchase_date::DATE BETWEEN $1::DATE AND $2::DATE
            GROUP BY s.id_supplier, s.company_name, s.rif
            ORDER BY total_purchases DESC, total_amount DESC LIMIT 10`,
      [date1, date2],
    );
    return {
      data: results,
      total_suppliers: results.length,
      date_range: {
        from: date1,
        to: date2,
      },
    };
  }

  /**
   * Entradas y salidas de productos con paginación y filtro de fechas
   */
  async getProductMovements(query: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const { page = 1, limit = 10, startDate, endDate } = query;
    const offset = (page - 1) * limit;
    // Entradas: compras, Salidas: ventas
    // Unificamos movimientos de compras y ventas
    let params: (string | number)[] = [];
    let where = '';
    if (startDate && endDate) {
      where = `WHERE m.fecha BETWEEN $1 AND $2`;
      params = [startDate, endDate];
    }
    const sql = `
            SELECT * FROM (
                SELECT 
                    p.id_product,
                    p.name AS product_name,
                    'ENTRADA' AS tipo_movimiento,
                    pi.quantity AS cantidad,
                    pi.cost_price AS precio_unitario,
                    pu.purchase_date AS fecha,
                    s.company_name AS proveedor_cliente
                FROM purchases_items pi
                INNER JOIN purchases pu ON pu.id_purchase = pi.id_purchase
                INNER JOIN products p ON p.id_product = pi.id_product
                INNER JOIN suppliers s ON s.id_supplier = pu.id_supplier
                WHERE pu.purchase_status = 'PAID'
                
                UNION ALL
                
                SELECT 
                    p.id_product,
                    p.name AS product_name,
                    'SALIDA' AS tipo_movimiento,
                    si.quantity AS cantidad,
                    si.unit_price AS precio_unitario,
                    s.sale_date AS fecha,
                    c.first_name || ' ' || c.last_name AS proveedor_cliente
                FROM sales_items si
                INNER JOIN sales s ON s.id_sale = si.id_sale
                INNER JOIN products p ON p.id_product = si.id_product
                INNER JOIN customers c ON c.id_customer = s.id_customer
                WHERE s.sale_status = 'PAID'
            ) m
            ${where}
            ORDER BY m.fecha DESC
            OFFSET $${params.length + 1} LIMIT $${params.length + 2}
        `;
    params.push(offset, limit);
    const data = await this.dataSource.query(sql, params);
    // Total count para paginación
    let countSql = `SELECT COUNT(*) FROM (
            SELECT pu.purchase_date AS fecha FROM purchases_items pi
            INNER JOIN purchases pu ON pu.id_purchase = pi.id_purchase
            WHERE pu.purchase_status = 'PAID'
            UNION ALL
            SELECT s.sale_date AS fecha FROM sales_items si
            INNER JOIN sales s ON s.id_sale = si.id_sale
            WHERE s.sale_status = 'PAID'
        ) m`;
    if (startDate && endDate) {
      countSql += ` WHERE m.fecha BETWEEN $1 AND $2`;
    }
    const countParams = startDate && endDate ? [startDate, endDate] : [];
    const total = await this.dataSource.query(countSql, countParams);
    return {
      data,
      page: Number(page),
      limit: Number(limit),
      total: Number(total[0]?.count || 0),
    };
  }
}
