import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    // 1. Productos con stock mínimo
    async getProductsMinStock() {
        return await this.dataSource.query(`
      SELECT * FROM get_products_min_stock
    `);
    }

    // 2. Productos sin ventas en 30 días
    async getProductsWithoutSales30Days() {
        return await this.dataSource.query(`
      SELECT * FROM products_without_sales_30days
    `);
    }

    // 3. Resumen inventario (costo vs venta)
    async getInventorySummaryCostVsSale() {
        return await this.dataSource.query(`
      SELECT * FROM inventory_summary_cost_vs_sale
    `);
    }

    /**
 * Total de ventas en un rango de fechas
 */
    async getSalesCountByDate(date1: string, date2: string) {
        const result = await this.dataSource.query(
            `SELECT * FROM get_sales_count_by_date($1, $2)`,
            [date1, date2]
        );
        return {
            sales_count: result[0]?.sales_count || 0,
            date_range: {
                from: date1,
                to: date2
            }
        };
    }

    /**
     * Total de compras en un rango de fechas
     */
    async getPurchasesCountByDate(date1: string, date2: string) {
        const result = await this.dataSource.query(
            `SELECT * FROM get_purchases_count_by_date($1, $2)`,
            [date1, date2]
        );
        return {
            purchases_count: result[0]?.purchases_count || 0,
            date_range: {
                from: date1,
                to: date2
            }
        };
    }

    /**
     * Top 5 productos más vendidos en un rango de fechas
     */
    async getFiveProductsMoreSales(date1: string, date2: string) {
        const results = await this.dataSource.query(
            `SELECT * FROM get_five_products_more_sales($1, $2)`,
            [date1, date2]
        );
        return {
            data: results,
            total_products: results.length,
            date_range: {
                from: date1,
                to: date2
            }
        };
    }

    /**
     * Top 5 clientes con más compras en un rango de fechas
     */
    async getFiveCustomersMostPurchases(date1: string, date2: string) {
        const results = await this.dataSource.query(
            `SELECT * FROM get_five_customers_most_purchases($1, $2)`,
            [date1, date2]
        );
        return {
            data: results,
            total_customers: results.length,
            date_range: {
                from: date1,
                to: date2
            }
        };
    }

    /**
     * Top 10 proveedores más frecuentes en un rango de fechas
     */
    async getTopSuppliers(date1: string, date2: string) {
        console.log(date2);
        const results = await this.dataSource.query(
            `SELECT * FROM get_top_suppliers($1, $2)`,
            [date1, date2]
        );
        return {
            data: results,
            total_suppliers: results.length,
            date_range: {
                from: date1,
                to: date2
            }
        };
    }
}
