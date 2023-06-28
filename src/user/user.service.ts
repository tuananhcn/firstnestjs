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
    const shop = jwt.verify(token, process.env.secretToken).shop
    const query = `SELECT * FROM session_entity where shop = "${shop}"`
    const Session = (await this.sessionRepository.query(query))[0];
    console.log(shop)
    Session.isOnline = (Session.isOnline == 1 ? true : false);
    return Session;
  }
  generateUniqueNumberId(): number {
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
    //   session: await this.getSession(token),
    //   apiVersion: ApiVersion.January23,
    // });
    // const postResponse = await (client).post({
    //   path: 'products',
    //   data: {
    //     product: {
    //       title: createProductDto.title
    //     }
    //   },
    //   type: DataType.JSON,
    // });
    // console.log(postResponse.body);
    // return postResponse;
    console.log(createProductDto);
    const shop = await (await this.getSession(token)).shop;
    const newProduct = new productEntity()
    //  = {
    newProduct.id = this.generateUniqueNumberId();
    newProduct.title = createProductDto.title;
    newProduct.shop = shop;
    newProduct.body_html = createProductDto.body_html;
    // }
    // console.log(createProductDto)
    // console.log(newProduct);
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
    const newCustomer = new customerEntity()
    // = {
    newCustomer.id = this.generateUniqueNumberId()
    newCustomer.name = createCustomerDto.name
    newCustomer.shop = shop
    newCustomer.email = createCustomerDto.email
    newCustomer.country = createCustomerDto.country
    newCustomer.city = createCustomerDto.city
    // }
    await this.customerRepository.save(newCustomer);
  }
  async saveProducts(vendor) {
    const query = `SELECT * FROM session_entity where shop = "${vendor}"`
    const session = (await this.sessionRepository.query(query))[0];
    session.isOnline = (session.isOnline == 1 ? true : false);
    const shopifyProducts = (await shopify.rest.Product.all({
      session: session
    })).data;
    // console.log(shopifyProducts);
    const products = shopifyProducts.map(async (shopifyProduct) => {
      const product = new productEntity();
      product.id = shopifyProduct.id;
      product.shop = `${vendor}`;
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
  async saveCustomers(vendor) {
    // let session = (await this.sessionRepository.findOneBy({shop: `${vendor}.myshopify.com`}))
    // session.isOnline = (session.isOnline == 1 ? true : false);
    const query = `SELECT * FROM session_entity where shop = "${vendor}"`
    const session = (await this.sessionRepository.query(query))[0];
    session.isOnline = (session.isOnline == 1 ? true : false);
    const shopifyCustomers = (await shopify.rest.Customer.all({
      session: session
    })).data;
    const customers = await shopifyCustomers.map(async (shopifyCustomer) => {
      const customer = new customerEntity();
      customer.id = shopifyCustomer.id;
      customer.shop = `${vendor}`;
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
  async deleteSession(vendor) {
    // Session is built by the OAuth process
    // const query1 = `SELECT * FROM session_entity where shop = "${vendor}"`
    // const session = (await this.sessionRepository.query(query1))[0];
    // console.log(session)
    // let response = await shopify.rest.Webhook.all({
    //   session: session,
    // });
    // const webhooks = response.data
    // console.log(webhooks)

    // webhooks.map(async (webhook) => {
    //   await shopify.rest.Webhook.delete({
    //     session: session,
    //     id: webhook.id,
    //   })
    // });
    const query = `DELETE FROM session_entity where shop = "${vendor}"`
    await this.sessionRepository.query(query);
    // webhooks.map((webhook)=>webhook.id)
  }
}