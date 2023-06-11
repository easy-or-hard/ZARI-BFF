import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../entities/userEntity';

export class CreateUserDto extends PickType(UserEntity, [
  'provider',
  'providerId',
  'email',
]) {
  displayName: string;
}
