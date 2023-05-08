import { PartialType } from '@nestjs/swagger';
import { CreateBanzzackDto } from './create-banzzack.dto';

export class UpdateBanzzackDto extends PartialType(CreateBanzzackDto) {}
