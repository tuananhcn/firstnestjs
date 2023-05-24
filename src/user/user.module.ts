import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sessionEntity } from 'src/auth/sessionEntity';

@Module({
  imports: [TypeOrmModule.forFeature([sessionEntity])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
