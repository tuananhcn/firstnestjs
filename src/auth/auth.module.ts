import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { sessionEntity } from './sessionEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([sessionEntity])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
