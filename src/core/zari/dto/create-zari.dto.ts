import { ApiProperty } from '@nestjs/swagger';

export class CreateZariDto {
  @ApiProperty({ example: 5 })
  zodiacId: number;

  @ApiProperty({ example: 2 })
  byeolId: number;
}
