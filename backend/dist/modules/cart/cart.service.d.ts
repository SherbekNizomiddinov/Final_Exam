export interface CartItem {
    productId: number;
    quantity: number;
}
export declare class CartService {
    private carts;
    getCart(userId: number): CartItem[];
    addItem(userId: number, productId: number, quantity: number): CartItem[];
    removeItem(userId: number, productId: number): CartItem[];
    updateQuantity(userId: number, productId: number, quantity: number): CartItem[];
    clearCart(userId: number): void;
}
