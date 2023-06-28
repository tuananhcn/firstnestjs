import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { sessionEntity } from './sessionEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { productEntity } from '../user/productEntity';
import { customerEntity } from '../user/customerEntity';
@Module({
  imports: [TypeOrmModule.forFeature([sessionEntity,productEntity,customerEntity])],
  controllers: [AuthController],
  providers: [AuthService,UserService]
})
export class AuthModule {}
