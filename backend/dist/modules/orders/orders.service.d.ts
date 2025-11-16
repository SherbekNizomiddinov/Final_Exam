import { CartService } from '../cart/cart.service';
export interface Order {
    id: number;
    userId: number;
    items: any[];
    address: string;
    shippingMethod: string;
    paymentMethod: string;
    status: string;
    createdAt: Date;
}
export declare class OrdersService {
    private cartService;
    private orders;
    constructor(cartService: CartService);
    createOrder(userId: number, address: string, shippingMethod: string, paymentMethod: string): Order;
    getUserOrders(userId: number): Order[];
    getAllOrders(): Order[];
}
