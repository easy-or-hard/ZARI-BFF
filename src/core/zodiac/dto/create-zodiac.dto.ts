import { ApiProperty } from '@nestjs/swagger';

export class CreateZodiacDto {
  @ApiProperty({ example: '사수' })
  symbol: string;

  @ApiProperty({ example: '11-22' })
  startMonthDay: string;

  @ApiProperty({ example: '12-21' })
  endMonthDay: string;
}
