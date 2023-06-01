import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as ejs from 'ejs';
import puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer'
@Injectable()
export class InvoicesService {
    async sendEmail(data){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nguyenanhtuan2205tn@gmail.com',
                pass: 'mqogokuhtwiodroe'
            }
        });
        const pdfBuffer = await this.generateInvoicePdf(data);
        const message = {
            from: 'nguyenanhtuan2205tn@gmail.com',
            to: data.customer.email,
            subject: `You have a order at ${data.company.name}`,
            text: 'Please find attached the invoice.',
            attachments: [
              {
                filename: 'invoice.pdf',
                content: pdfBuffer,
              },
            ],
        };
        try {
            await transporter.sendMail(message);
            console.log('Email sent successfully!');
          } catch (error) {
            console.error('Error sending email:', error);
          } 
    }
    renderHtmlTemplate(data){
        const templatePath = "src/templates/invoice-template.ejs";
        const template = fs.readFileSync(templatePath, 'utf-8');
        const renderedTemplate = ejs.render(template, data);
        return renderedTemplate;
    }
    async generateInvoicePdf(data) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(this.renderHtmlTemplate(data), { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({format: 'A4'});
        await browser.close();
        return pdfBuffer;
    }
}
