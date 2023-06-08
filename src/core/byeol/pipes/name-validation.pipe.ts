import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NameValidationPipe implements PipeTransform {
  transform(value: any) {
    this.allowCharacterValidate(value);
    this.lengthValidate(value);
    return value;
  }

  private allowCharacterValidate(value: any) {
    const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]+$/;
    const condition = regex.test(value);
    if (!condition) {
      throw new BadRequestException('특수문자/공백은 사용할 수 없어요');
    }
  }

  private lengthValidate(value: any) {
    const condition = value.length >= 2;
    if (!condition) {
      throw new BadRequestException('두글자 이상 적어주세요');
    }
  }
}
