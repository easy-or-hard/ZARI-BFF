import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  provider: string;

  @IsNumber()
  providerId: number;

  @IsOptional()
  json: string;
}
