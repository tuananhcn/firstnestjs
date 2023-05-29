import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
// import { shopify } from './main';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
@Get()
  redirectMerchant(@Req() req: Request, @Res() res: Response) {
    this.appService.redirect(req,res);
}
}
