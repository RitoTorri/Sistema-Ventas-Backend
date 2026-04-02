import { Controller, HttpCode, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import { RolesGuard } from '../../shared/guards/permissions.guard';
import { CheckPermission } from '../../shared/decorators/permissions.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import Docs from './reports.swagger';

@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Productos con stock mínimo
  @Docs.getProductsMinStock()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('products-min-stock')
  async getProductsMinStock() {
    return await this.reportsService.getProductsMinStock();
  }

  // Productos sin ventas en 30 días
  @Docs.getProductsWithoutSales()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('products-without-sales')
  async getProductsWithoutSales() {
    return await this.reportsService.getProductsWithoutSales30Days();
  }

  // Resumen de inventario (costo vs venta)
  @Docs.getInventorySummary()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('inventory-summary')
  async getInventorySummary() {
    return await this.reportsService.getInventorySummaryCostVsSale();
  }

  // Total de ventas por rango de fechas
  @Docs.getSalesCount()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('sales-count')
  async getSalesCount(
    @Query('date1') date1: string,
    @Query('date2') date2?: string,
  ) {
    const startDate = date1;
    const endDate = date2 ? date2 : new Date().toISOString().split('T')[0];

    return await this.reportsService.getSalesCountByDate(startDate, endDate);
  }

  // Total de compras por rango de fechas
  @Docs.getPurchasesCount()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('purchases-count')
  async getPurchasesCount(
    @Query('date1') date1: string,
    @Query('date2') date2?: string,
  ) {
    const startDate = date1;
    const endDate = date2 ? date2 : new Date().toISOString().split('T')[0];

    return await this.reportsService.getPurchasesCountByDate(
      startDate,
      endDate,
    );
  }

  // Top 5 productos más vendidos
  @Docs.getTopProducts()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('top-products')
  async getTopProducts(
    @Query('date1') date1: string,
    @Query('date2') date2?: string,
  ) {
    const startDate = date1;
    const endDate = date2 ? date2 : new Date().toISOString().split('T')[0];

    return await this.reportsService.getFiveProductsMoreSales(
      startDate,
      endDate,
    );
  }

  // Top 10 clientes más frecuentes
  @Docs.getTopCustomers()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('top-customers')
  async getTopCustomers(
    @Query('date1') date1: string,
    @Query('date2') date2?: string,
  ) {
    const startDate = date1;
    const endDate = date2 ? date2 : new Date().toISOString().split('T')[0];

    return await this.reportsService.getFiveCustomersMostPurchases(
      startDate,
      endDate,
    );
  }

  // Top 10 proveedores más frecuentes
  @Docs.getTopSuppliers()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('top-suppliers')
  async getTopSuppliers(
    @Query('date1') date1: string,
    @Query('date2') date2?: string,
  ) {
    const startDate = date1;
    const endDate = date2 ? date2 : new Date().toISOString().split('T')[0];

    return await this.reportsService.getTopSuppliers(startDate, endDate);
  }

  // Entradas y salidas de productos (movimientos)
  @Docs.getProductMovements()
  @CheckPermission('READ', 'REPORTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @HttpCode(200)
  @Get('product-movements')
  async getProductMovements(@Query() query: any) {
    // Se espera paginación y filtro de fechas en el query
    return await this.reportsService.getProductMovements(query);
  }
}
