import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
// import { shopify } from 'src/main';
import { CreateProductDto } from './createProduct.dto';
import { createCustomer } from './createCustomer.dto';
import { productEntity } from './productEntity';
import { title } from 'process';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Get('products')
    async getProducts()
    {   
        return this.userService.getProducts();
    }
    @Get('customers')
    async getCustomers()
    {
        return this.userService.getCustomers();
    }
    @Post('products')
    async createProduct(@Body() createProductDto: CreateProductDto)
    {
        // console.log(createProductDto);
        return this.userService.createProducts(createProductDto);
    }
    @Post('customers')
    async createCustomer(@Body() createCustomerDto: createCustomer)
    {
        return this.userService.createCustomers(createCustomerDto);
        // return "Successfully created!";
    }
    
}