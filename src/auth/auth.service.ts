import { Injectable, Query, Req, Res } from '@nestjs/common';
import { shopify } from 'src/main';
import { InjectRepository } from '@nestjs/typeorm';
import { sessionEntity } from './sessionEntity';
import { Repository } from 'typeorm';
// import { callback } from '@shopify/shopify-api/lib/auth/oauth/oauth';
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
            return Session;
        }
        catch(err)
        {
            console.log(err);
        }
        // console.log(res)
        // res.Redirect('user');
    }
}
