import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import '@shopify/shopify-api/adapters/node';
import { ApiVersion, shopifyApi } from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';
export const shopify = shopifyApi({
  apiKey: '4812556eb70346f17ec2703828aeea9e',
  apiSecretKey: 'd20805ada294e6660f87a247ed52e628',
  scopes: ['write_products','write_customers'],
  hostName: 'localhost:4000',
  apiVersion: ApiVersion.July22,
  isEmbeddedApp: true,
  hostScheme: 'http',
  restResources
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(4000);
}
bootstrap();
