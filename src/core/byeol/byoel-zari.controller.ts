import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ByeolService } from './byeol.service';
import { ZariService } from '../zari/zari.service';
import { AuthGuard } from '@nestjs/passport';
import { ZariEntity } from '../zari/entities/zari.entity';
import { UniqueZariDto } from '../zari/dto/service/unique-zari.dto';

@Controller('byeols/:name/zaris')
@ApiTags('별/자리')
export class ByeolZariController {
  constructor(
    private readonly byeolService: ByeolService,
    private readonly zariService: ZariService,
  ) {}

  @Get(':constellationIAU')
  @ApiOperation({ summary: '자리 찾기' })
  @ApiOkResponse({
    description: '자리를 찾았어요',
    type: ZariEntity,
  })
  getZari(
    @Param('name') name: string,
    @Param('constellationIAU') constellationIAU: string,
  ) {
    return this.zariService.findByByeolNameAndConstellationIAU(
      name,
      constellationIAU,
    );
  }

  @Post(':constellationIAU')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '자리 만들기' })
  @ApiOkResponse({
    description: '자리를 만들었어요',
    type: ZariEntity,
  })
  async postByeolZari(
    @Param('name') name: string,
    @Param('constellationIAU') constellationIAU: string,
    @Req() req: Request,
  ) {
    const user = req['user'];
    await this.byeolService.notOwnerThenThrow(name, user);

    return this.zariService.createByUnique(user, constellationIAU);
  }

  @Delete(':constellationIAU')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '자리 지우기' })
  @ApiOkResponse({
    description: '자리를 지웠어요',
  })
  async deleteZari(
    @Param('name') name: string,
    @Param('constellationIAU') constellationIAU: string,
    @Req() req: Request,
  ) {
    const user = req['user'];
    await this.byeolService.notOwnerThenThrow(name, user);

    const unique: UniqueZariDto = {
      byeolId: user.byeolId,
      constellationIAU: constellationIAU,
    };

    return this.zariService.deleteUniqueByeolIdConstellationIAUZari(unique);
  }
}
