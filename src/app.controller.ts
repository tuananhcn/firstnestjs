import { Controller, Get, Query, Req, Res, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { sessionEntity } from './auth/sessionEntity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { shopify } from './main';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>) {}
@Get()
  async redirectMerchant(@Res() res,@Query() query) {
      const shop = query.shop
      const isChecked = await this.appService.check(shop);
      if(!isChecked)
      //   return {url: `api/auth?shop=${shop}`}
      // return {get,url: `http://localhost:5173/` }
        return res.redirect(`/api/auth?shop=${shop}`)
      
      return res.redirect(`${process.env.ngrokFrontEnd}?token=${isChecked}`);
}
}
