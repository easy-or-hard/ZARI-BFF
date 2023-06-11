import {
  Body,
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
import GetByeolIncludeZarisDto from './dto/response/get-byeol-include-zaris.dto';
import { PostByeolZariByDateDto } from './dto/request/post-byeol-zari-by-date.dto';
import { UniqueZariDto } from '../zari/dto/service/unique-zari.dto';
import { IncludeByeolUserDto } from '../../identity/user/dto/service/output/include-byeol-user.dto';

@Controller('byeols/:name/zaris')
@ApiTags('별/자리')
export class ByeolZariController {
  constructor(
    private readonly byeolService: ByeolService,
    private readonly zariService: ZariService,
  ) {}

  @Get()
  @ApiOperation({ summary: '별의 자리들 가져오기' })
  @ApiOkResponse({
    description: '별의 자리들을 가져왔어요',
    type: GetByeolIncludeZarisDto,
  })
  getZaris(@Param('name') name: string) {
    return this.byeolService.findUniqueName(name);
  }

  @Get(':constellationIAU')
  getByeolZari(
    @Param('name') name: string,
    @Param('constellationIAU') constellationIAU: string,
  ) {
    return this.byeolService.findUniqueNameAndConstellationIAU(
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
    const user: IncludeByeolUserDto = req['user'];
    await this.byeolService.notOwnerThenThrow(name, user);

    return this.zariService.createByUnique(user, constellationIAU);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '날짜로 자리 만들기' })
  @ApiOkResponse({
    description: '자리를 만들었어요',
    type: ZariEntity,
  })
  async postByeolZariByDate(
    @Param('name') name: string,
    @Body() date: PostByeolZariByDateDto,
    @Req() req: Request,
  ) {
    const user: IncludeByeolUserDto = req['user'];
    await this.byeolService.notOwnerThenThrow(name, user);

    return this.zariService.createByDate(user, date);
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
    const user: IncludeByeolUserDto = req['user'];
    await this.byeolService.notOwnerThenThrow(name, user);

    const unique: UniqueZariDto = {
      byeolId: user.byeolId,
      constellationIAU: constellationIAU,
    };

    return this.zariService.deleteUniqueByeolIdConstellationIAUZari(unique);
  }
}
