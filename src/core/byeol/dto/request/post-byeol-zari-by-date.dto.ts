import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PostByeolZariByDateDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number, description: '월' })
  month: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number, description: '일' })
  day: number;
}
