import { Injectable, Query, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { shopify } from 'src/shopify';
import { sessionEntity } from './auth/sessionEntity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
  @InjectRepository(sessionEntity)
  private readonly sessionRepository: Repository<sessionEntity>){} 
  async check(shop){
    const shopInf = await this.sessionRepository.findOneBy({shop})
    if(shopInf)
      return true;
    return false;
  }
}
