import { ApiProperty, PickType } from '@nestjs/swagger';
import { ByeolEntity } from '../../entities/byeol.entity';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateByeolDto extends PickType(ByeolEntity, ['name'] as const) {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number, description: '태어난 달' })
  birthMonth: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1, type: Number, description: '태어난 날' })
  birthDay: number;
}
