"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
let ProductsService = class ProductsService {
    constructor() {
        this.products = [
            {
                id: 1,
                name: 'Apple iPhone 14 Pro Max',
                price: 1399,
                description: 'Display: 6.7" Super Retina XDR with 120Hz ProMotion Chip: A16 Bionic Main Camera: 48MP triple-camera system Front Camera: 12MP TrueDepth Battery Life: Up to 29 hours video playback Storage Options: 128GB, 256GB, 512GB, 1TB Build: Stainless steel, Ceramic Shield, IP68 water resistance Features: Dynamic Island, Always-On Display, Face ID, 5G support',
                image: '/images/iphone-14-pro-max.png',
                category: 'Phones',
                stock: 50,
            },
            {
                id: 2,
                name: 'Apple iPhone 15 Pro Max',
                price: 1599,
                description: 'Display: 6.7″ Super Retina XDR OLED, 120 Hz ProMotion Chip: A17 Pro Main Camera: 48 MP (wide) + 12 MP (ultra-wide) + 12 MP (telephoto, 5× optical zoom) Front Camera: 12 MP Construction / Material: Titanium frame + glass back, Ceramic Shield front Storage Options: 256 GB, 512 GB, 1 TB Water Resistance: IP68 (up to 6 m for 30 min) Other Features: Dynamic Island, Always-On display',
                image: '/images/iphone-15-pro-max.png',
                category: 'Phones',
                stock: 60,
            },
            {
                id: 3,
                name: 'Apple iPhone 16 Pro Max',
                price: 1799,
                description: 'Display: 6.9" Super Retina XDR, 120Hz ProMotion Chip: A18 Pro Cameras: 48Mp main 48MP Ultra-Wide Front Camera: 12MP Battery Life: Up to 33 hours video playback Storage Options: 256GB, 512GB, 1TB',
                image: '/images/iphone-16-pro-max.png',
                category: 'Phones',
                stock: 45,
            },
            {
                id: 4,
                name: 'Apple iPhone 17 Pro Max',
                price: 1999,
                description: 'Display: 6.9″ Super Retina XDR OLED, 120Hz ProMotion Build / Material: Aluminum unibody + Ceramic Shield 2 front va back Chip: A19 Pro Storage Options: 256 GB, 512 GB, 1 TB, 2 TB Cameras: Triple 48 MP (main, ultra-wide, telephoto) Battery: Video playback up to 39 hours',
                image: '/images/iphone-17-pro-max.png',
                category: 'Phones',
                stock: 30,
            },
            {
                id: 5,
                name: 'Apple MacBook Air M2',
                price: 1199,
                description: 'Chip: Apple M2 (8-core CPU, 8 or 10-core GPU) Display: 13.6" Liquid Retina, 500 nits brightness Memory: 8GB / 16GB / 24GB unified memory Storage: 256GB, 512GB, 1TB, or 2TB SSD Battery Life: Up to 18 hours video playback Charging: MagSafe 3 + USB-C fast charging Camera: 1080p FaceTime HD Ports: 2× USB-C/Thunderbolt + Headphone jack Wireless: Wi-Fi 6, Bluetooth 5.3',
                image: '/images/macbook-air-m2.jpg',
                category: 'Laptops',
                stock: 30,
            },
            {
                id: 6,
                name: 'Apple MacBook Pro 14" M2 Pro ',
                price: 1999,
                description: 'Chip: Apple M2 Pro (10‑core yoki 12‑core CPU) GPU: 16‑core yoki 19‑core variantlari Memory (RAM): 16 GB (up to 32 GB) Storage: 512 GB – 8 TB SSD Display: 14.2″ Liquid Retina XDR, 120 Hz ProMotion, HDR Battery Life: Up to 18 hours video playback Ports: 3× Thunderbolt 4, HDMI, SD card slot, 3.5 mm headphone jack Camera: 1080p FaceTime HD camera',
                image: '/images/macbook-pro-14-m2-pro.jpg',
                category: 'Laptops',
                stock: 25,
            },
            {
                id: 7,
                name: 'Apple MacBook Pro 16" M2 Max',
                price: 3499,
                description: 'Chip: Apple M2 Max (12-core CPU, 30- or 38-core GPU) Memory (RAM): 32 GB (up to 96 GB) Storage: 1 TB – 8 TB SSD Display: 16.2″ Liquid Retina XDR, 3456×2234, 120 Hz ProMotion, HDR Battery Life: Up to 22 hours video playback Ports: 3× Thunderbolt 4, HDMI, SDXC card slot, 3.5 mm headphone jack, MagSafe 3 Connectivity: Wi‑Fi 6E, Bluetooth 5.3 Camera: 1080p FaceTime HD Weight: 2.16 kg',
                image: '/images/macbook-pro-16-m2-max.jpg',
                category: 'Laptops',
                stock: 15,
            },
            {
                id: 8,
                name: 'Apple MacBook Air 15" M2',
                price: 1299,
                description: 'Chip: Apple M2 (8-core CPU, 10-core GPU) Memory (RAM): 8 GB (up to 24 GB) Storage: 256 GB – 2 TB SSD Display: 15.3″ Liquid Retina, 2880×1864, 500 nits brightness Battery Life: Up to 18 hours video playback Ports: 2× Thunderbolt / USB‑4, 3.5 mm headphone jack Connectivity: Wi‑Fi 6, Bluetooth 5.3 Camera: 1080p FaceTime HD Audio: Six-speaker system, Spatial Audio ',
                image: '/images/macbook-air-15-m2.jpg',
                category: 'Laptops',
                stock: 20,
            },
            {
                id: 9,
                name: 'Apple MacBook Pro 13" M2',
                price: 1499,
                description: 'Chip: Apple M2 (8-core CPU, 10-core GPU) Memory (RAM): 8 GB (up to 24 GB) Storage: 256 GB – 2 TB SSD Display: 13.3″ Retina, 2560×1600, 500 nits brightness Battery Life: Up to 20 hours video playback Ports: 2× Thunderbolt / USB‑4, 3.5 mm headphone jack Connectivity: Wi‑Fi 6, Bluetooth 5.0 Camera: 720p FaceTime HD Audio: Stereo speakers with 3-microphone array Keyboard: Magic Keyboard with Touch Bar and Touch ID',
                image: '/images/macbook-pro-13-m2.jpg',
                category: 'Laptops',
                stock: 25,
            },
            {
                id: 10,
                name: 'Apple iPad Pro 12.9" (2024)',
                price: 1299,
                description: 'Chip: Apple M4 Display: 12.9″ Liquid Retina XDR, Mini-LED, ProMotion 10–120 Hz, 1000 nits full-screen, 1600 nits HDR peak Storage: 256 GB, 512 GB, 1 TB, 2 TB Cameras: 12Mp Connectivity: Thunderbolt / USB‑4, Wi‑Fi 6E, Bluetooth 5.3 Apple Pencil / Keyboard: Supports Apple Pencil Pro and Magic Keyboard Operating System: iPadOS Design: Thin, premium build',
                image: '/images/ipad-pro-12-9.png',
                category: 'Tablets',
                stock: 40,
            },
            {
                id: 11,
                name: 'Apple iPad Air 5th Gen',
                price: 599,
                description: 'Chip: Apple M1 (8-core CPU, 8-core GPU) Memory (RAM): 8 GB Storage: 64 GB yoki 256 GB Display: 10.9″ Liquid Retina, 2360×1640, 500 nits brightness, P3 wide color, True Tone Display: 10.9″ Liquid Retina, 2360×1640, 500 nits brightness, P3 wide color, True Tone Front Camera: 12 MP Ultra-Wide with Center Stage Operating System: iPadOS',
                image: '/images/ipad-air-5.jpg',
                category: 'Tablets',
                stock: 50,
            },
            {
                id: 12,
                name: 'Apple Watch Series 9',
                price: 399,
                description: 'Chip: Apple M1 (8-core CPU, 8-core GPU) Memory (RAM): 8 GB Display: 10.9″ Liquid Retina, 2360×1640, 500 nits brightness, P3 wide color, True Tone Rear Camera: 12 MP Wide Connectivity: USB‑C, Wi‑Fi 6, Bluetooth 5.0, optional 5G Biometrics: Touch ID (power button) Speakers: Stereo',
                image: '/images/apple-watch-series-9.jpg',
                category: 'Wearables',
                stock: 75,
            },
            {
                id: 13,
                name: 'Apple Watch Ultra',
                price: 799,
                description: 'Material: Aerospace-grade titanium case — strong and lightweight Water & Dust Resistance: Up to 100 m water resistance, IP6X dust resistant Processor: S8 SiP chip Display: 1.92″ LTPO OLED, always-on, up to 3000 nits brightness GPS: L1 + L5 GPS, also supports GLONASS, Galileo, and others Sensors: Always-on altimeter, compass, heart rate sensor, SpO2 sensor, depth sensor,',
                image: '/images/apple-watch-ultra.jpg',
                category: 'Wearables',
                stock: 20,
            },
            {
                id: 14,
                name: 'Apple AirPods Pro (2nd Generation)',
                price: 249,
                description: 'Chip: Apple H2 Active Noise Cancellation (ANC): Yes, enhanced Transparency Mode: Adaptive, reduces loud sudden noises Spatial Audio: Personalized 3D audio with dynamic head tracking Controls: Tap for play/pause, double-tap next track, triple-tap previous, press and hold Battery Life: Up to 6 hours listening (ANC on), 30 hours with charging case Charging Case: MagSafe, USB-C, built-in speaker for Find My Connectivity: Bluetooth 5.3',
                image: '/images/airpods-pro-2.png',
                category: 'Audio',
                stock: 100,
            },
            {
                id: 15,
                name: 'Apple AirPods Max',
                price: 549,
                description: 'Chip: Apple H1 Audio: Active Noise Cancellation, Transparency Mode, Spatial Audio, Adaptive EQ Controls: Digital Crown (volume, play/pause, skip, Siri), Noise Control button Battery: Up to 20 hours (ANC on) Connectivity: Bluetooth 5.0 Weight: ~386 g ',
                image: '/images/airpods-max.jpg',
                category: 'Audio',
                stock: 30,
            },
            {
                id: 16,
                name: 'Apple HomePod Mini',
                price: 99,
                description: 'Size & Weight: 84.3 mm tall × 97.9 mm wide, 345 g Audio: Full-range driver, dual passive radiators, 360° sound, computational audio Voice Assistant: Siri with 4 far-field microphones Multiroom: AirPlay 2, can pair two for stereo Controls: Tap, double-tap, triple-tap, touch & hold for Siri, volume buttons Sensors: Temperature and humidity sensors Connectivity: Wi‑Fi, Bluetooth 5.0, Thread, Ultra Wideband Power: 20 W adapter',
                image: '/images/homepod-mini.jpg',
                category: 'Audio',
                stock: 60,
            },
        ];
    }
    findAll(search) {
        const filteredProducts = search
            ? this.products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()))
            : this.products;
        console.log('Returning products with images:', filteredProducts.map(p => ({ id: p.id, name: p.name, image: p.image })));
        return filteredProducts;
    }
    findOne(id) {
        const product = this.products.find((p) => p.id === id);
        if (product) {
            console.log(`Found product ${product.name} with image: ${product.image}`);
        }
        else {
            console.log(`Product with id ${id} not found`);
        }
        return product;
    }
    create(product) {
        const newProduct = Object.assign(Object.assign({ id: this.products.length + 1 }, product), { image: product.image || '/images/placeholder.jpg' });
        this.products.push(newProduct);
        console.log(`Created product ${newProduct.name} with image: ${newProduct.image}`);
        return newProduct;
    }
    delete(id) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index > -1) {
            console.log(`Deleted product with id ${id}`);
            this.products.splice(index, 1);
            return true;
        }
        console.log(`Product with id ${id} not found for deletion`);
        return false;
    }
    update(id, product) {
        const existingProduct = this.findOne(id);
        if (existingProduct) {
            Object.assign(existingProduct, product, { image: product.image || existingProduct.image || '/images/placeholder.jpg' });
            console.log(`Updated product ${existingProduct.name} with image: ${existingProduct.image}`);
        }
        return existingProduct;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map