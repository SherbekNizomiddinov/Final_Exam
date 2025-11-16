"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("../cart/cart.service");
let OrdersService = class OrdersService {
    constructor(cartService) {
        this.cartService = cartService;
        this.orders = [];
    }
    createOrder(userId, address, shippingMethod, paymentMethod) {
        const cart = this.cartService.getCart(userId);
        if (cart.length === 0) {
            throw new Error('Cart is empty');
        }
        const order = {
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
    getUserOrders(userId) {
        return this.orders.filter((o) => o.userId === userId);
    }
    getAllOrders() {
        return this.orders;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map