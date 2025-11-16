import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.service'; // Import qilingan

@Injectable()
export class AdminService {
  constructor(private productsService: ProductsService) {}

  getAllProducts(): Product[] {
    return this.productsService.findAll();
  }

  addProduct(product: any): Product { // `any` o'rniga `Product` ishlatish tavsiya qilinadi
    return this.productsService.create(product);
  }

  deleteProduct(id: number): boolean {
    return this.productsService.delete(id);
  }

  updateProduct(id: number, product: any): Product | undefined { // `any` o'rniga `Partial<Product>` ishlatish yaxshiroq
    return this.productsService.update(id, product);
  }
} 