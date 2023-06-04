import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class PostByeolDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number, description: '태어난 달' })
  birthMonth: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number, description: '태어난 날' })
  birthDay: number;
}
