import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
    constructor(private readonly invoiceService: InvoicesService){}
    @Post('send')
    async sendEmail(@Body() body: any){
        try {
            await this.invoiceService.sendEmail(body);
        } catch (error) {
            return error;
        }
        return "Email sent successfully!";
    }
}
