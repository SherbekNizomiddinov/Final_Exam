import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('api/orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  createOrder(
    @Request() req,
    @Body()
    body: {
      address: string;
      shippingMethod: string;
      paymentMethod: string;
    },
  ) {
    return this.ordersService.createOrder(
      req.user.userId,
      body.address,
      body.shippingMethod,
      body.paymentMethod,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  getUserOrders(@Request() req) {
    return this.ordersService.getUserOrders(req.user.userId);
  }
}
