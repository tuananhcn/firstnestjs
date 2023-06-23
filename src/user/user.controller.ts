import { Body, Controller, Get, Post, Query, Req, Res, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service';
// import { shopify } from 'src/main';
import { CreateProductDto } from './createProduct.dto';
import { CreateCustomerDto } from './createCustomer.dto';
import { productEntity } from './productEntity';
import { title } from 'process';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Get('products')
    async getProducts(@Query() params: any, @Headers() header)
    {   
        // params.id = `offline_${params.id}.myshopify.com`;
        const token = header.authorization.split(' ')[1]
        return await this.userService.getProducts(token);
        // return params.id;
    }
    @Get('customers')
    async getCustomers(@Query() params: any, @Headers() header)
    {
        const token = header.authorization.split(' ')[1]
        return await this.userService.getCustomers(token);
    }
    @Post('products')
    async createProduct(@Body() createProductDto: CreateProductDto, @Headers() header)
    {
        const token = header.authorization.split(' ')[1]
        try {
            await this.userService.createProducts(createProductDto, token);
            return "Created successfully!";
        } catch (error) {
            return error;
        }
    }
    @Post('customers')
    async createCustomer(@Body() createCustomerDto: CreateCustomerDto, @Headers() header)
    {
        const token = header.authorization.split(' ')[1]
        try {
            await this.userService.createCustomers(createCustomerDto, token);
            return "Created successfully!"
        } catch (error) {
            return error;
        }
        // return "Successfully created!";
    }
    @Get('receiveData')
    async getDataFromShopify(@Query() params: any, @Headers() header)
    {
        const token = header.authorization.split(' ')[1]
        try {
        await this.userService.saveCustomers(token);
        await this.userService.saveProducts(token);
        } catch (error) {
            return error;
        }
        return "success";
    }
}