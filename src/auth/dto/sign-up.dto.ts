import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Validate,
  Matches,
  ArrayMaxSize,
} from 'class-validator';
import { Gender } from '../../users/types/Gender.type';
import { Region } from '../../users/types/region.type';
import { Pet } from '../../users/types/pet.type';
import { BodyShape } from '../../users/types/bodyshape.type';
import { Mbti } from '../../users/types/mbti.type';
import { Religion } from '../../users/types/religion.type';
import { Frequency } from '../../users/types/frequency.type';
import { IsPasswordMatchingConstraint } from 'src/utils/decorators/password-match.decorator';
import { Transform, Type } from 'class-transformer';
import { IMAGE_LIMIT } from '../constants/auth.constants';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, { message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)' })
  phoneNum: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @Validate(IsPasswordMatchingConstraint)
  readonly passwordConfirm: string;

  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEnum(Frequency)
  smokingFreq: Frequency;

  @IsNotEmpty()
  @IsEnum(Frequency)
  drinkingFreq: Frequency;

  @IsNotEmpty()
  @IsEnum(Religion)
  religion: Religion;

  @IsNotEmpty()
  @IsEnum(Mbti)
  mbti: Mbti;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  height: number;

  @IsNotEmpty()
  @IsEnum(BodyShape)
  bodyShape: BodyShape;

  @IsNotEmpty()
  @IsEnum(Pet)
  pet: Pet;

  @IsNotEmpty()
  @IsEnum(Region)
  region: Region;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  interests: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  techs: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(IMAGE_LIMIT)
  @IsString({ each: true })
  profileImageUrls: string[];
}
