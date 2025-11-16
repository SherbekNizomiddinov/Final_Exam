import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';

export interface Order { // `export` qo'shildi
  id: number;
  userId: number;
  items: any[];
  address: string;
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  constructor(private cartService: CartService) {}

  createOrder(
    userId: number,
    address: string,
    shippingMethod: string,
    paymentMethod: string,
  ): Order {
    const cart = this.cartService.getCart(userId);

    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const order: Order = {
      id: this.orders.length + 1,
      userId,
      items: cart,
      address,
      shippingMethod,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
    };

    this.orders.push(order);
    this.cartService.clearCart(userId);

    return order;
  }

  getUserOrders(userId: number): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  getAllOrders(): Order[] {
    return this.orders;
  }
}