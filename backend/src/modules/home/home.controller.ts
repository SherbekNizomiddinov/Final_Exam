import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class HomeController {
  @Get()
  getHome() {
    return { message: 'Welcome to Cyber E-commerce API!' };
  }
}