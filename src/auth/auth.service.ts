import { Injectable, Query, Req, Res } from '@nestjs/common';
import { shopify } from 'src/shopify';
import { InjectRepository } from '@nestjs/typeorm';
import { sessionEntity } from './sessionEntity';
import { Repository } from 'typeorm';
import { Response } from 'express';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(sessionEntity)
        private readonly sessionRepository: Repository<sessionEntity>){}
    async saveUserSession(req: Request,res: Response){
        try
        {
            const callback = await shopify.auth.callback({
                rawRequest: req,
                rawResponse: res,
            });
            console.log(callback.session);
            const Session = callback.session;
            await this.sessionRepository.save(Session);
            console.log("Saved session to db!");
            res.redirect("http://localhost:5173");
        }
        catch(err)
        {
            console.log(err);
        }
    }
}
