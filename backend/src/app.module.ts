import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { HomeModule } from './modules/home/home.module'; // Qo'shildi

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    UsersModule,
    AdminModule,
    HomeModule, // Qo'shildi
  ],
})
export class AppModule {}