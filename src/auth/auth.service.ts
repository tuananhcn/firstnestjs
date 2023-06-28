import { Injectable, Query, Req, Res } from '@nestjs/common';
import { shopify } from 'src/shopify';
import { InjectRepository } from '@nestjs/typeorm';
import { sessionEntity } from './sessionEntity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import { DeliveryMethod } from '@shopify/shopify-api';
import { UserService } from '../user/user.service';
// import { sessionEntity } from 'src/auth/sessionEntity';

dotenv.config()
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(sessionEntity)
        private readonly sessionRepository: Repository<sessionEntity>, private readonly userService: UserService) { }
    async saveUserSession(req, res) {
        try {
            const callback = await shopify.auth.callback({
                rawRequest: req,
                rawResponse: res,
            });
            // console.log(callback.session);
            const Session = callback.session;
            await this.sessionRepository.save(Session);
            this.userService.saveCustomers(Session.shop)
            this.userService.saveProducts(Session.shop)
            console.log("Saved session to db!");
            let token
            token = jwt.sign({ shop: Session.shop }, process.env.secretToken)
            console.log(token)
            console.log(jwt.verify(token, 'sfgsdfgsdbsdbsdfsdnsdnds'))
            // shopify.webhooks.addHandlers({
            //     PRODUCTS_CREATE: [
            //         {
            //             deliveryMethod: DeliveryMethod.Http,
            //             callbackUrl: '/user/webhook',
            //             callback: async (topic, shop, body) => {
            //                 console.log(body)
            //             },
            //
            //     }
            // ]
            // APP_UNINSTALLED: [
            //     {
            //         deliveryMethod: DeliveryMethod.Http,
            //         callbackUrl: '/webhooks',
            //         callback: async (topic, shop, body) => {
            //             console.log(body)
            //         }, //
            //     }
            // ]
            // })
            // Session.isOnline = false;
            console.log(callback.session)
            let webhook = new shopify.rest.Webhook({
                session: callback.session
            })
            webhook.address = `${process.env.ngrokBackEnd}/user/productUpdate`;
            webhook.topic = "products/update";
            webhook.format = "json";
            await webhook.save({
                update: true,
            });
            webhook = new shopify.rest.Webhook({
                session: callback.session
            })
            webhook.address = `${process.env.ngrokBackEnd}/user/productUpdate`;
            webhook.topic = "products/create";
            webhook.format = "json";
            await webhook.save({
                update: true,
            });
            webhook = new shopify.rest.Webhook({
                session: callback.session
            })
            webhook.address = `${process.env.ngrokBackEnd}/user/customerUpdate`;
            webhook.topic = "customers/update";
            webhook.format = "json";
            await webhook.save({
                update: true,
            });
            webhook = new shopify.rest.Webhook({
                session: callback.session
            })
            webhook.address = `${process.env.ngrokBackEnd}/user/customerUpdate`;
            webhook.topic = "customers/create";
            webhook.format = "json";
            await webhook.save({
                update: true,
            });
            webhook = new shopify.rest.Webhook({
                session: callback.session
            })
            webhook.address = `${process.env.ngrokBackEnd}/user/sessionDelete`;
            webhook.topic = "app/uninstalled";
            webhook.format = "json";
            await webhook.save({
                update: true,
            });
            // console.log(webhook.)
            // const response = await shopify.webhooks.register({
            //     session: callback.session,
            // });
            // console.log(response.result);
            // if (!response['PRODUCTS_CREATE'][0].success) {
            //     console.log(
            //         `Failed to register PRODUCTS_CREATE webhook`,
            //     );
            // }
            res.redirect(`${process.env.ngrokFrontEnd}?token=${token}`);
        }
        catch (err) {
            console.log(err);
        }
    }
    async redirect(req, res, query) {
        console.log(query.shop)
        await shopify.auth.begin({ //redirect to shopify
            shop: shopify.utils.sanitizeShop(query.shop, true),
            callbackPath: '/api/redirect',
            isOnline: false,
            rawRequest: req,
            rawResponse: res,
        });
    }

}
