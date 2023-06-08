import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as ejs from 'ejs';
import puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer'
import { error } from 'console';
import { async } from 'rxjs';
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
    async writeToPdf(data){
      console.log(data);
      const htmlBuffer = await this.renderHtmlTemplate(data);
      const pdfBuffer = await this.generateInvoicePdf(data);
      fs.writeFile('src/templates/output.pdf', pdfBuffer, (error) => {
        if (error) {
          console.error('Error writing PDF file:', error);
        } else {
          console.log('PDF file written successfully!');
        }
      })
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
        // await page.setViewport({ width: 1920, height: 1080 });
        await page.setContent(this.renderHtmlTemplate(data), { waitUntil: 'networkidle0' });
        const width = await page.evaluate(()=> document.documentElement.scrollWidth);
        const height = await page.evaluate(()=> document.documentElement.scrollHeight);
        const pdfBuffer = await page.pdf({ printBackground: true,width: width, height: height,pageRanges:'1' });
        await browser.close();
        return pdfBuffer;
    }
    test(data){
      console.log(data);
    }
}
