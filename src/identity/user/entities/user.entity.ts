import { User, UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class UserEntity implements User {
  @ApiProperty({ example: 1, type: Number })
  id: number;
  @ApiProperty({ example: '김별', type: String })
  provider: string;

  @ApiProperty({ example: 1, type: Number })
  providerId: number;

  @ApiProperty({ example: 1, type: Number })
  byeolId: number;
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'byeol@zari.com', type: String })
  email: string;
  @IsEnum(UserRole)
  @ApiProperty({ example: 'USER', type: String, enum: UserRole })
  role: UserRole;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
