import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sessionEntity } from './auth/sessionEntity';
import { productEntity } from './user/productEntity';
import { customerEntity } from './user/customerEntity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { shopify } from 'src/shopify';
import { InvoicesModule } from './invoices/invoices.module';
import {WebhookMiddleware} from 'src/user/webhook.middleware'
@Module({
  imports: [AuthModule, ConfigModule.forRoot({isGlobal: true}), UserModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test',
    entities: [sessionEntity,productEntity,customerEntity],
    synchronize: true,
  }), InvoicesModule, TypeOrmModule.forFeature([sessionEntity])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(WebhookMiddleware)
      .forRoutes('user/productUpdate','user/customerUpdate','user/sessionDelete')
  }
}
