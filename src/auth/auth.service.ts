import { Injectable, Query, Req, Res } from '@nestjs/common';
import { shopify } from 'src/shopify';
import { InjectRepository } from '@nestjs/typeorm';
import { sessionEntity } from './sessionEntity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config()
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(sessionEntity)
        private readonly sessionRepository: Repository<sessionEntity>){}
    async saveUserSession(req ,res){
        try
        {
            const callback = await shopify.auth.callback({
                rawRequest: req,
                rawResponse: res,
            });
            console.log(callback.session);
            const Session = callback.session;
            await this.sessionRepository.save(Session);
            Session.accessToken = jwt.sign({accessToken: Session.accessToken}, process.env.secretToken)
            console.log(Session.accessToken)
            console.log(jwt.verify(Session.accessToken, 'sfgsdfgsdbsdbsdfsdnsdnds'))
            console.log("Saved session to db!");
            res.redirect(`https://91fe-2402-800-61b3-3f08-d1fd-af05-8688-da6d.ngrok-free.app?token=${Session.accessToken}`);
        }
        catch(err)
        {
            console.log(err);
        }
    }
    async redirect(req ,res, query) {
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
