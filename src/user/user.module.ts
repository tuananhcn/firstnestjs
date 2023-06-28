import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sessionEntity } from 'src/auth/sessionEntity';
import { productEntity } from './productEntity';
import { customerEntity } from './customerEntity';

@Module({
  imports: [TypeOrmModule.forFeature([sessionEntity,productEntity,customerEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
