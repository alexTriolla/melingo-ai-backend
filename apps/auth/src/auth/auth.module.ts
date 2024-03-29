import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AwsModule } from '@app/aws';

@Module({
  imports: [AwsModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
