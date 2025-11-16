import { Injectable } from '@nestjs/common';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [
    // Phones
    {
      id: 1,
      name: 'Apple iPhone 14 Pro Max',
      price: 1399,
      description: 'Latest Apple iPhone with advanced camera system',
      image: '/images/iphone-14-pro-max.png',
      category: 'Phones',
      stock: 50,
    },
    {
      id: 2,
      name: 'Apple iPhone 15 Pro Max',
      price: 1599,
      description: 'Newest iPhone with A17 Bionic chip and improved camera',
      image: '/images/iphone-15-pro-max.png',
      category: 'Phones',
      stock: 60,
    },
    {
      id: 3,
      name: 'Apple iPhone 16 Pro Max',
      price: 1799,
      description: 'Flagship iPhone with cutting-edge display technology',
      image: '/images/iphone-16-pro-max.png',
      category: 'Phones',
      stock: 45,
    },
    {
      id: 4,
      name: 'Apple iPhone 17 Pro Max',
      price: 1999,
      description: 'Next-generation iPhone with revolutionary camera features',
      image: '/images/iphone-17-pro-max.png',
      category: 'Phones',
      stock: 30,
    },

    // Laptops (MacBooks)
    {
      id: 5,
      name: 'Apple MacBook Air M2',
      price: 1199,
      description: 'Lightweight laptop with M2 chip for powerful performance',
      image: '/images/macbook-air-m2.jpg',
      category: 'Laptops',
      stock: 30,
    },
    {
      id: 6,
      name: 'Apple MacBook Pro 14" M2 Pro',
      price: 1999,
      description: 'Professional laptop with M2 Pro chip for heavy workloads',
      image: '/images/macbook-pro-14-m2-pro.jpg',
      category: 'Laptops',
      stock: 25,
    },
    {
      id: 7,
      name: 'Apple MacBook Pro 16" M2 Max',
      price: 3499,
      description: 'High-end MacBook for designers and developers',
      image: '/images/macbook-pro-16-m2-max.jpg',
      category: 'Laptops',
      stock: 15,
    },
    {
      id: 8,
      name: 'Apple MacBook Air 15" M2',
      price: 1299,
      description: 'Bigger Air model for productivity on the go',
      image: '/images/macbook-air-15-m2.jpg',
      category: 'Laptops',
      stock: 20,
    },
    {
      id: 9,
      name: 'Apple MacBook Pro 13" M2',
      price: 1499,
      description: 'Compact MacBook Pro with M2 chip',
      image: '/images/macbook-pro-13-m2.jpg',
      category: 'Laptops',
      stock: 25,
    },

    // Tablets
    {
      id: 10,
      name: 'Apple iPad Pro 12.9" (2024)',
      price: 1299,
      description: 'High-performance tablet with M2 chip and Apple Pencil support',
      image: '/images/ipad-pro-12-9.png',
      category: 'Tablets',
      stock: 40,
    },
    {
      id: 11,
      name: 'Apple iPad Air 5th Gen',
      price: 599,
      description: 'Lightweight iPad with A14 chip for everyday tasks',
      image: '/images/ipad-air-5.jpg',
      category: 'Tablets',
      stock: 50,
    },

    // Wearables
    {
      id: 12,
      name: 'Apple Watch Series 9',
      price: 399,
      description: 'Advanced fitness tracking smartwatch with new features',
      image: '/images/apple-watch-series-9.jpg',
      category: 'Wearables',
      stock: 75,
    },
    {
      id: 13,
      name: 'Apple Watch Ultra',
      price: 799,
      description: 'Premium rugged smartwatch for extreme conditions',
      image: '/images/apple-watch-ultra.jpg',
      category: 'Wearables',
      stock: 20,
    },
    {
      id: 14,
      name: 'Apple AirPods Pro (2nd Generation)',
      price: 249,
      description: 'Noise-cancelling wireless earbuds with excellent sound',
      image: '/images/airpods-pro-2.png',
      category: 'Audio',
      stock: 100,
    },
    {
      id: 15,
      name: 'Apple AirPods Max',
      price: 549,
      description: 'Over-ear headphones with spatial audio and high-fidelity sound',
      image: '/images/airpods-max.jpg',
      category: 'Audio',
      stock: 30,
    },
    {
      id: 16,
      name: 'Apple HomePod Mini',
      price: 99,
      description: 'Compact smart speaker with Siri integration',
      image: '/images/homepod-mini.jpg',
      category: 'Audio',
      stock: 60,
    },
  ];

  findAll(search?: string): Product[] {
    const filteredProducts = search
      ? this.products.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()),
        )
      : this.products;

    console.log('Returning products with images:', filteredProducts.map(p => ({ id: p.id, name: p.name, image: p.image })));
    return filteredProducts;
  }

  findOne(id: number): Product | undefined {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      console.log(`Found product ${product.name} with image: ${product.image}`);
    } else {
      console.log(`Product with id ${id} not found`);
    }
    return product;
  }

  create(product: Product): Product {
    const newProduct = {
      id: this.products.length + 1,
      ...product,
      image: product.image || '/images/placeholder.jpg',
    };
    this.products.push(newProduct);
    console.log(`Created product ${newProduct.name} with image: ${newProduct.image}`);
    return newProduct;
  }

  delete(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index > -1) {
      console.log(`Deleted product with id ${id}`);
      this.products.splice(index, 1);
      return true;
    }
    console.log(`Product with id ${id} not found for deletion`);
    return false;
  }

  update(id: number, product: Partial<Product>): Product | undefined {
    const existingProduct = this.findOne(id);
    if (existingProduct) {
      Object.assign(existingProduct, product, { image: product.image || existingProduct.image || '/images/placeholder.jpg' });
      console.log(`Updated product ${existingProduct.name} with image: ${existingProduct.image}`);
    }
    return existingProduct;
  }
}
