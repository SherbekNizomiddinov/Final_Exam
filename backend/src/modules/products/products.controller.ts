import { Controller, Get, Post, Delete, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { Product } from './products.service'; // Import qilingan

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with optional search' })
  findAll(@Query('search') search?: string): Product[] {
    return this.productsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string): Product | undefined {
    return this.productsService.findOne(parseInt(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Admin only)' })
  create(@Body() product: Product): Product { // `any` o'rniga `Product`
    return this.productsService.create(product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  delete(@Param('id') id: string): { message: string } {
    const deleted = this.productsService.delete(parseInt(id));
    return { message: deleted ? 'Product deleted' : 'Product not found' };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  update(@Param('id') id: string, @Body() product: Partial<Product>): Product | undefined {
    return this.productsService.update(parseInt(id), product);
  }
}