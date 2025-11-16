import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('api/admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Post('products')
  @ApiOperation({ summary: 'Add new product (Admin only)' })
  addProduct(@Body() product: any) {
    return this.adminService.addProduct(product);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(parseInt(id));
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product (Admin only)' })
  updateProduct(@Param('id') id: string, @Body() product: any) {
    return this.adminService.updateProduct(parseInt(id), product);
  }
}
