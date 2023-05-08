import { PartialType } from '@nestjs/swagger';
import { CreateByeolDto } from './create-byeol.dto';

export class UpdateByeolDto extends PartialType(CreateByeolDto) {}
