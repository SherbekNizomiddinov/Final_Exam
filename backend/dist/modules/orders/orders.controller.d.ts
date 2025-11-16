import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any, body: {
        address: string;
        shippingMethod: string;
        paymentMethod: string;
    }): import("./orders.service").Order;
    getUserOrders(req: any): import("./orders.service").Order[];
}
