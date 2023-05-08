import { PartialType } from '@nestjs/swagger';
import { CreateZodiacDto } from './create-zodiac.dto';

export class UpdateZodiacDto extends PartialType(CreateZodiacDto) {}
