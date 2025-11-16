export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
}
export declare class ProductsService {
    private products;
    findAll(search?: string): Product[];
    findOne(id: number): Product | undefined;
    create(product: Product): Product;
    delete(id: number): boolean;
    update(id: number, product: Partial<Product>): Product | undefined;
}
