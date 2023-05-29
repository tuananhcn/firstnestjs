import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
// import { shopify } from 'src/main';
import { AuthService } from './auth.service';
import { ApiVersion } from '@shopify/shopify-api';

@Controller('api')
// @Redirect('user')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Get('auth')
    async getUsers(@Req() req, @Res() res)
    {
        return await this.authService.saveUserSession(req,res);
        // console.log(this.authService.getSessionBySessionId(callback));
        // const Sessions = await this.authService.getSessionBySessionId(id);
        // const Session = Sessions[0];   
        // res.json(await this.authService.getSessionBySessionId(callback));
    }

}

