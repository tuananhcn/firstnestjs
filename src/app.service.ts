import { Injectable, Query, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { shopify } from 'src/shopify';
import { sessionEntity } from './auth/sessionEntity';
import { Repository } from 'typeorm';
import * as jwt from "jsonwebtoken";
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>) { }
  async check(shop) {
    const shopInf = await this.sessionRepository.findOneBy({ shop })
    if (shopInf) {
      console.log(shopInf.shop)
      return jwt.sign({ shop: shopInf.shop }, process.env.secretToken);
    }
    return false;
  }
  //   async returnToken(shop) {
  //     const query = `DELETE FROM session_entity where shop = "${shop}"`
  //     const Session = await this.sessionRepository.query(query);
  //     return jwt.sign({ accessToken: Session.accessToken }, process.env.secretToken)
  // }
}
