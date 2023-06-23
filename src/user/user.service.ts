import { Body, Header, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiVersion, DataType } from '@shopify/shopify-api';
import { sessionEntity } from 'src/auth/sessionEntity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './createProduct.dto';
import { CreateCustomerDto } from './createCustomer.dto';
import { productEntity } from './productEntity';
import { customerEntity } from './customerEntity';
import { Product } from '@shopify/shopify-api/rest/admin/2022-07/product';
import { async } from 'rxjs';
import { shopify } from 'src/shopify';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import * as jwt from "jsonwebtoken";
// import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config()
// import { getClientBySession }
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>,
    @InjectRepository(productEntity)
    private readonly productRepository: Repository<productEntity>,
    @InjectRepository(customerEntity)
    private readonly customerRepository: Repository<customerEntity>) { }

  async getSession(token) {
    const shopifyToken = jwt.verify(token, process.env.secretToken).accessToken
    const query = `SELECT * FROM session_entity where accessToken = "${shopifyToken}"`
    const Session = (await this.sessionRepository.query(query))[0];
    Session.isOnline = (Session.isOnline == 1 ? true : false);
    return Session;
  }
  generateUniqueNumberId():number {
    const timestamp = Date.now().toString(); // Get current timestamp as a string
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a random 10-digit number
    const uniqueId = parseInt(timestamp + randomNum.toString().slice(-3), 10);
    return uniqueId;
  }
  async getProducts(token) {
    const shop = await (await this.getSession(token)).shop
    console.log(shop)
    const query = `SELECT * FROM product_entity where shop = "${shop}"`;
    console.log(this.generateUniqueNumberId());
    return (await this.productRepository.query(query));
  }
  async getCustomers(token) {
    const shop = await (await this.getSession(token)).shop;
    const query = `SELECT * FROM customer_entity where shop = "${shop}"`;
    return (await this.customerRepository.query(query));
  }
  async createProducts(createProductDto: CreateProductDto, token) {
    // const client = new shopify.clients.Rest({
    //   session: await this.getSession(),
    //   apiVersion: ApiVersion.January23,
    // });
    // const postResponse = await (client).post({
    //   path: 'products',
    //   data: {
    //     product: {
    //       title: createUserDto.title
    //     }
    //   },
    //   type: DataType.JSON,
    // });
    // console.log(postResponse.body);
    // return postResponse;
    // console.log(createProductDto);
    // const shop = await (await this.getSession(id)).shop;    
    const shop = await (await this.getSession(token)).shop;
    const newProduct: productEntity = {
      id: this.generateUniqueNumberId(),
      title: createProductDto.title,
      shop: shop,
      body_html: createProductDto.body_html
    }
    console.log(createProductDto)
    console.log(newProduct);
    return this.productRepository.save(newProduct);
  }
  async createCustomers(createCustomerDto: CreateCustomerDto, token) {
    // const customer = new shopify.rest.Customer({
    //   session: await this.getSession()
    // });
    // customer.last_name = createCustomerDto.last_name;
    // customer.first_name = createCustomerDto.first_name;
    // customer.email = createCustomerDto.email;
    // await customer.save({
    //   update: true,
    // })
    const shop = await (await this.getSession(token)).shop;
    const newCustomer: customerEntity = {
      id: this.generateUniqueNumberId(),
      name: createCustomerDto.name,
      shop: shop,
      email: createCustomerDto.email,
      country: createCustomerDto.country,
      city: createCustomerDto.city
    }
    await this.customerRepository.save(newCustomer);
  }
  async saveProducts(token) {
    const shopifyProducts = (await shopify.rest.Product.all({
      session: await this.getSession(token)})).data;
    console.log(shopifyProducts);
    const products = shopifyProducts.map(async(shopifyProduct) => {
      const product = new productEntity();
      product.id = shopifyProduct.id;
      product.shop = await (await this.getSession(token)).shop;
      product.title = shopifyProduct.title;
      product.body_html = shopifyProduct.body_html;
      // await this.productRepository.save(product);
      await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(productEntity)
      .values(product)
      .orUpdate({ conflict_target: ['id'], overwrite: ['title'] })
      .execute();
    })
    // return "ok"
  }
  async saveCustomers(token) {
    const shopifyCustomers = (await shopify.rest.Customer.all({
      session: await this.getSession(token)})).data;
    // const shopifyCustomers = (await axios.get(`https://${id}.myshopify.com/admin/api/2023-04/customers.json`,{headers: {'X-Shopify-Access-Token': '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' }})).data
    const customers = await shopifyCustomers.map(async(shopifyCustomer) => {
      const customer = new customerEntity();
      customer.id = shopifyCustomer.id;
      customer.shop = await (await this.getSession(token)).shop;
      customer.name = `${shopifyCustomer.first_name} ${shopifyCustomer.last_name}`;
      customer.email = shopifyCustomer.email;
      customer.country = shopifyCustomer.country;
      customer.city = shopifyCustomer.city;
      // await this.customerRepository.save(customer);
      await this.customerRepository
      .createQueryBuilder()
      .insert()
      .into(customerEntity)
      .values(customer)
      .orUpdate({ conflict_target: ['id'], overwrite: ['name'] })
      .execute();
    })
    // console.log(shopifyCustomers)
    // return "ok"
  }
}