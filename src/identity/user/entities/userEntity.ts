import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UserEntity implements User {
  @ApiProperty({ example: 1, type: Number })
  id: number;
  @ApiProperty({ example: '김별', type: String })
  provider: string;

  @ApiProperty({ example: '1', type: String })
  providerId: string;

  @ApiProperty({ example: 1, type: Number })
  byeolId: number;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'byeol@zari.com', type: String })
  email: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
