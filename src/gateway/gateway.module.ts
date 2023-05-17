import { Module } from '@nestjs/common';
import { SignInGateway } from './sign-in.gateway';

@Module({
  providers: [SignInGateway],
  exports: [SignInGateway],
})
export class GatewayModule {}
