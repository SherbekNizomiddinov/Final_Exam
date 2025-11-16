import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getAllProducts(): import("../products/products.service").Product[];
    addProduct(product: any): import("../products/products.service").Product;
    deleteProduct(id: string): boolean;
    updateProduct(id: string, product: any): import("../products/products.service").Product;
}
