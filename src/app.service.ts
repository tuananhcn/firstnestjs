import { Injectable, Query, Req, Res } from '@nestjs/common';
import { shopify } from 'src/shopify';

@Injectable()
export class AppService {
  async redirect(req: Request,res: Response) {
    await shopify.auth.begin({ //redirect to shopify
      shop: "gumbee-14526.myshopify.com",
      callbackPath: '/api/auth',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  }
}
