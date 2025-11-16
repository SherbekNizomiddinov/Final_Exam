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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const cart_service_1 = require("./cart.service");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(req) {
        return this.cartService.getCart(req.user.userId);
    }
    addItem(req, body) {
        return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
    }
    removeItem(req, productId) {
        return this.cartService.removeItem(req.user.userId, parseInt(productId));
    }
    updateQuantity(req, productId, body) {
        return this.cartService.updateQuantity(req.user.userId, parseInt(productId), body.quantity);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user cart' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Put)(':productId/quantity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update item quantity' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateQuantity", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('api/cart'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map