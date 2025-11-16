import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
