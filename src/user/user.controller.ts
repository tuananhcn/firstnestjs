import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { shopify } from 'src/main';
import { CreateUserDto } from './createProduct.dto';
import { createCustomer } from './createCustomer.dto';

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
    async createProduct(@Body() createUserDto: CreateUserDto)
    {
        return this.userService.createProducts(createUserDto);
    }
    @Post('customers')
    async createCustomer(@Body() createCustomerDto: createCustomer)
    {
        try {
            this.userService.createCustomers(createCustomerDto);
            return "Successfully created!";
        } catch (error) {
            return error;
        }
    }
    
}