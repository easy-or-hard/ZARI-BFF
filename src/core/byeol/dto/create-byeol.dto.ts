import { ApiProperty } from '@nestjs/swagger';

export class CreateByeolDto {
  @ApiProperty({ example: '킹태희' })
  name: string;

  @ApiProperty({ example: '1' })
  zariId: number;
}
