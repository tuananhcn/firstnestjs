import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto'
@Injectable()
export class WebhookMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // const hmacHeader = req.headers['x-shopify-hmac-sha256']
    // const data = req.body
    // console.log(req)
    // const caculatedHmac = crypto.createHmac('sha256', process.env.apiSecretKey).update(JSON.stringify(data), 'utf-8').digest('hex')
    // if(hmacHeader === caculatedHmac)
        // console.log(hmacHeader)
    // else
        // console.log(caculatedHmac)
        // console.log("FAILED!!!!")
    next();
  }
}
