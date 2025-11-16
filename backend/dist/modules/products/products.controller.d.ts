import { ProductsService } from './products.service';
import { Product } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(search?: string): Product[];
    findOne(id: string): Product | undefined;
    create(product: Product): Product;
    delete(id: string): {
        message: string;
    };
    update(id: string, product: Partial<Product>): Product | undefined;
}
