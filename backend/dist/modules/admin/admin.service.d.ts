import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.service';
export declare class AdminService {
    private productsService;
    constructor(productsService: ProductsService);
    getAllProducts(): Product[];
    addProduct(product: any): Product;
    deleteProduct(id: number): boolean;
    updateProduct(id: number, product: any): Product | undefined;
}
