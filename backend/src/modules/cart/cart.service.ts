import { Injectable } from '@nestjs/common';

export interface CartItem { // `export` qo'shildi
  productId: number;
  quantity: number;
}

@Injectable()
export class CartService {
  private carts: { [userId: number]: CartItem[] } = {};

  getCart(userId: number): CartItem[] {
    return this.carts[userId] || [];
  }

  addItem(userId: number, productId: number, quantity: number): CartItem[] {
    if (!this.carts[userId]) {
      this.carts[userId] = [];
    }

    const existingItem = this.carts[userId].find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.carts[userId].push({ productId, quantity });
    }

    return this.carts[userId];
  }

  removeItem(userId: number, productId: number): CartItem[] {
    if (this.carts[userId]) {
      this.carts[userId] = this.carts[userId].filter((item) => item.productId !== productId);
    }
    return this.carts[userId] || [];
  }

  updateQuantity(userId: number, productId: number, quantity: number): CartItem[] {
    const cart = this.carts[userId];
    if (cart) {
      const item = cart.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    return cart || [];
  }

  clearCart(userId: number): void {
    this.carts[userId] = [];
  }
}