import { Body, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiVersion, DataType } from '@shopify/shopify-api';
import { sessionEntity } from 'src/auth/sessionEntity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './createProduct.dto';
import { createCustomer } from './createCustomer.dto';
import { productEntity } from './productEntity';
import { customerEntity } from './customerEntity';
import { Product } from '@shopify/shopify-api/rest/admin/2022-07/product';
import { async } from 'rxjs';
import { shopify } from 'src/shopify';
import * as nodemailer from 'nodemailer';

// import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { v4 as uuidv4 } from 'uuid';
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

  async getSession() { 
    const query = "SELECT * FROM session_entity where id = 'offline_gumbee-14526.myshopify.com'"
    const Session = (await this.sessionRepository.query(query))[0];
    Session.isOnline = (Session.isOnline == 1 ? true : false);
    console.log(Session);
    return Session;
  }
  async getProducts() {
    const query = "SELECT * FROM product_entity";
    return (await this.productRepository.query(query));
  }
  async getCustomers() {
    const query = "SELECT * FROM customer_entity";
    return (await this.customerRepository.query(query));
  }
  async createProducts(createProductDto: CreateProductDto) {
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
    console.log(createProductDto);    
    const newProduct: productEntity = {
      id: uuidv4(),
      title: createProductDto.title,
      body_html: createProductDto.body_html
    }
    // console.log(newProduct);
    return this.productRepository.save(newProduct);
  }
  async createCustomers(createCustomerDto: createCustomer) {
    // const customer = new shopify.rest.Customer({
    //   session: await this.getSession()
    // });
    // customer.last_name = createCustomerDto.last_name;
    // customer.first_name = createCustomerDto.first_name;
    // customer.email = createCustomerDto.email;
    // await customer.save({
    //   update: true,
    // })
    const newCustomer: customerEntity = {
      id: uuidv4(),
      email: createCustomerDto.email,
      country: createCustomerDto.country,
      city: createCustomerDto.city
    }
    return this.customerRepository.save(newCustomer);
  }
  async saveProducts() {
    const shopifyProducts = (await shopify.rest.Product.all({
      session: await this.getSession()})).data;
    const products = shopifyProducts.map(async(shopifyProduct) => {
      const product = new productEntity();
      product.id = shopifyProduct.id;
      product.title = shopifyProduct.title;
      product.body_html = shopifyProduct.body_html;
      await this.productRepository.save(product);
    })
    return "ok"
  }
  async saveCustomers() {
    const shopifyCustomers = (await shopify.rest.Customer.all({
      session: await this.getSession()})).data;
    const customers = shopifyCustomers.map(async(shopifyCustomer) => {
      const customer = new customerEntity();
      customer.id = shopifyCustomer.id;
      customer.email = shopifyCustomer.email;
      customer.country = shopifyCustomer.country;
      customer.city = shopifyCustomer.city;
      await this.customerRepository.save(customer);
    })
    return "ok"
  }
  sendEmail(){
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'nguyenanhtuan2205tn@gmail.com',
        pass: '@Anh2252003',
      },
    });
    const mailOptions = {
      from: "",
      to: "",
      subject: "",
      text: "",
    };
    transporter.sendEmail(mailOptions, (error,info) => {
      if(error) {
        console.log("Error sending email:", error);
      }
      else {
        console.log("Email sent:", info.response);
      }
    });
  }
}