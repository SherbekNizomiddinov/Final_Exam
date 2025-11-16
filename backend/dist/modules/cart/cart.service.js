"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
let CartService = class CartService {
    constructor() {
        this.carts = {};
    }
    getCart(userId) {
        return this.carts[userId] || [];
    }
    addItem(userId, productId, quantity) {
        if (!this.carts[userId]) {
            this.carts[userId] = [];
        }
        const existingItem = this.carts[userId].find((item) => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            this.carts[userId].push({ productId, quantity });
        }
        return this.carts[userId];
    }
    removeItem(userId, productId) {
        if (this.carts[userId]) {
            this.carts[userId] = this.carts[userId].filter((item) => item.productId !== productId);
        }
        return this.carts[userId] || [];
    }
    updateQuantity(userId, productId, quantity) {
        const cart = this.carts[userId];
        if (cart) {
            const item = cart.find((item) => item.productId === productId);
            if (item) {
                item.quantity = quantity;
            }
        }
        return cart || [];
    }
    clearCart(userId) {
        this.carts[userId] = [];
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
//# sourceMappingURL=cart.service.js.map