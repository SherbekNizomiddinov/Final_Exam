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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
let AdminService = class AdminService {
    constructor(productsService) {
        this.productsService = productsService;
    }
    getAllProducts() {
        return this.productsService.findAll();
    }
    addProduct(product) {
        return this.productsService.create(product);
    }
    deleteProduct(id) {
        return this.productsService.delete(id);
    }
    updateProduct(id, product) {
        return this.productsService.update(id, product);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map