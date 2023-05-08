import { PartialType } from '@nestjs/swagger';
import { CreateZariDto } from './create-zari.dto';

export class UpdateZariDto extends PartialType(CreateZariDto) {}
