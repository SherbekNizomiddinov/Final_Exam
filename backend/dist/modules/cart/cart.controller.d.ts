import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: any): import("./cart.service").CartItem[];
    addItem(req: any, body: {
        productId: number;
        quantity: number;
    }): import("./cart.service").CartItem[];
    removeItem(req: any, productId: string): import("./cart.service").CartItem[];
    updateQuantity(req: any, productId: string, body: {
        quantity: number;
    }): import("./cart.service").CartItem[];
}
