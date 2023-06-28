import { Body, Controller, Get, Post, Query, Req, Res, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service';
// import { shopify } from 'src/main';
import { CreateProductDto } from './createProduct.dto';
import { CreateCustomerDto } from './createCustomer.dto';
import { productEntity } from './productEntity';
import { title } from 'process';
import { shopify } from 'src/shopify';
import { Response } from 'express';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Post('productUpdate')
        async updateProduct(@Req() req, @Res() res: Response, @Headers() header){
            // try {
            //     // Note: the express.text() given above is an Express middleware that will read
            //     // in the body as a string, and make it available at req.body, for this path only.
            //     await shopify.webhooks.process({
            //       rawBody: req.body, // is a string
            //       rawRequest: req,
            //       rawResponse: res,
            //     });
            //   } catch (error) {
            //     console.log(error.message);
            //   }
            console.log(`Update product`)
            await this.userService.saveProducts(header['x-shopify-shop-domain'])
            res.status(200).send('OK')
        }
    @Post('customerUpdate')
        async updateCustomer(@Req() req, @Res() res: Response, @Headers() header){
            console.log('Update customer')
            await this.userService.saveCustomers(header['x-shopify-shop-domain'])
            res.status(200).send('OK')
        }
    @Post('sessionDelete')
        async deleteSession(@Req() req, @Res() res: Response, @Headers() header){
            console.log('Delete session')
            // console.log(header)
            await this.userService.deleteSession(header['x-shopify-shop-domain'])
            res.status(200).send('OK')
        }
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
    // @Post('products')
    // async createProduct(@Body() createProductDto: CreateProductDto, @Headers() header)
    // {
    //     const token = header.authorization.split(' ')[1]
    //     try {
    //         await this.userService.createProducts(createProductDto, token);
    //         return "Created successfully!";
    //     } catch (error) {
    //         return error;
    //     }
    // }
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
    @Post('products')
    async createProduct(@Body() createProductDto: CreateProductDto, @Headers() header)
    {
        const token = header.authorization.split(' ')[1]
        try {
            await this.userService.createProducts(createProductDto, token);
            return "Created successfully!"
        } catch (error) {
            return error;
        }
        // return "Successfully created!";
    }
    // @Get('receiveData')
    // async getDataFromShopify(@Query() params: any, @Headers() header)
    // {
    //     const token = header.authorization.split(' ')[1]
    //     try {
    //     await this.userService.saveCustomers(token);
    //     await this.userService.saveProducts(token);
    //     } catch (error) {
    //         return error;
    //     }
    //     return "success";
    // }
}