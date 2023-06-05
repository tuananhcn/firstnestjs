import { Body, Controller, Get, Post, Query, Req, Res, Param } from '@nestjs/common';
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
    async getProducts(@Query() params: any)
    {   
        params.id = `offline_${params.id}.myshopify.com`;
        return await this.userService.getProducts(params.id);
        // return params.id;
    }
    @Get('customers')
    async getCustomers(@Query() params: any)
    {
        params.id = `offline_${params.id}.myshopify.com`;
        return this.userService.getCustomers(params.id);
    }
    @Post('products')
    async createProduct(@Body() createProductDto: CreateProductDto)
    {
        // console.log(createProductDto);
        return this.userService.createProducts(createProductDto);
    }
    @Post('customers')
    async createCustomer(@Body() createCustomerDto: CreateCustomerDto)
    {
        return this.userService.createCustomers(createCustomerDto);
        // return "Successfully created!";
    }
    @Get('receiveData')
    async getDataFromShopify(@Query() params: any)
    {
        params.id = `offline_${params.id}.myshopify.com`;
        try {
        await this.userService.saveCustomers(params.id);
        await this.userService.saveProducts(params.id);
        } catch (error) {
            return error;
        }
        return "success";
    }
}