import { DynamicModule, Global, Module } from '@nestjs/common';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

import { AwsService } from './aws.service';
import { CognitoService } from './cognito/cognito.service';
import { JwtService } from '@nestjs/jwt';

type AwsModuleOptions = {
  userPoolId: string;
  clientId: string;
  tokenUse?: 'access' | 'id';
};

@Global()
@Module({})
export class AwsModule {
  static forRoot(options: AwsModuleOptions): DynamicModule {
    return {
      module: AwsModule,
      imports: [
        CognitoAuthModule.register({
          jwtVerifier: {
            userPoolId: options.userPoolId,
            clientId: options.clientId,
            tokenUse: options.tokenUse ?? 'access',
          },
        }),
      ],
      providers: [AwsService, CognitoService, JwtService],
      exports: [AwsService, CognitoService, JwtService],
    };
  }
}
