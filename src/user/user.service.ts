import { Body, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiVersion, DataType } from '@shopify/shopify-api';
import { sessionEntity } from 'src/auth/sessionEntity';
import { shopify } from 'src/main';
import { Repository } from 'typeorm';
import { CreateUserDto } from './createProduct.dto';
import { createCustomer } from './createCustomer.dto';
// import { getClientBySession }
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>) { }

  async getSession() {
    const query = "SELECT * FROM session_entity where id = 'offline_gumbee-14526.myshopify.com'"
    const Session = (await this.sessionRepository.query(query))[0];
    Session.isOnline = (Session.isOnline == 1 ? true : false);
    console.log(Session);
    return Session;
    // return client;
  }
  // async getProducts() {
  //   const getResponse = (await this.getClientBySessionId()).query({
  //     data: `query {
  //       products(first: 10, reverse: true) {
  //         edges {
  //           node {
  //             id
  //             title
  //           }
  //         }
  //       }
  //     }`,
  //   });
  //   // console.log(getResponse.body);
  //   return (await getResponse).body;
  // }
  // async getCustomers() {
  //   try {
  //     const getResponse = await (await this.getClientBySessionId()).query({
  //       data: `query {
  //         customers(first: 10) {
  //           edges {
  //             node {
  //               id
  //             }
  //           }
  //         }
  //       }`,
  //     });
  //     console.log(((await getResponse).body));
  //     return (await getResponse).body;
  //   } catch (error) {
  //     console.log(error.response.errors);
  //   }
  //   // console.log(getResponse.body);
  // }
  // interface MyResponseBodyType {
  //   products: {
  //     /* ... */
  //   };
  // }
  async getProducts() {
    return await shopify.rest.Product.all({
      session: await this.getSession(),
    });
  }
  async getCustomers() {
    return await shopify.rest.Customer.all({
      session: await this.getSession(),
      limit: 10,
    });
  }
  async createProducts(createUserDto: CreateUserDto) {
    // try {
    const client = new shopify.clients.Rest({
      session: await this.getSession(),
      apiVersion: ApiVersion.January23,
    });
    const postResponse = await (client).post({
      path: 'products',
      data: {
        product: {
          title: createUserDto.title
        }
      },
      type: DataType.JSON,
    });
    console.log(postResponse.body);
    return postResponse;
    // } catch (error) {
    //   console.log(error)
    // } 
  }
  async createCustomers(createCustomerDto: createCustomer) {
    // try {
    const customer = new shopify.rest.Customer({
      session: await this.getSession()
      // apiVersion: ApiVersion.January23,
    });
    customer.last_name = createCustomerDto.last_name;
    customer.first_name = createCustomerDto.first_name;
    customer.email = createCustomerDto.email;
    // } catch (error) {
    //   console.log(error)
    // } 
    await customer.save({
      update: true,
    })
  }
}