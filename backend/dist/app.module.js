"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const products_module_1 = require("./modules/products/products.module");
const cart_module_1 = require("./modules/cart/cart.module");
const orders_module_1 = require("./modules/orders/orders.module");
const users_module_1 = require("./modules/users/users.module");
const admin_module_1 = require("./modules/admin/admin.module");
const home_module_1 = require("./modules/home/home.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            home_module_1.HomeModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map