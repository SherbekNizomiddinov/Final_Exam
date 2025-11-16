import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('api/cart')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@Request() req, @Body() body: { productId: number; quantity: number }) {
    return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, parseInt(productId));
  }

  @Put(':productId/quantity')
  @ApiOperation({ summary: 'Update item quantity' })
  updateQuantity(@Request() req, @Param('productId') productId: string, @Body() body: { quantity: number }) {
    return this.cartService.updateQuantity(req.user.userId, parseInt(productId), body.quantity);
  }
}
