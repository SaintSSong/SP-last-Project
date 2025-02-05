import { Controller, Get, Post, Body, Patch, UseGuards, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from './entities/user.entity';
import { USER_MESSAGES } from './constants/user.message.constant';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { ProviderGuard } from 'src/auth/guards/provider.guard';
import { AllowedProviders } from 'src/utils/decorators/providers.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // 내 프로필 조회
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async find(@UserInfo() user: User): Promise<ApiResponse<User>> {
    return {
      statusCode: HttpStatus.OK,
      message: USER_MESSAGES.READ_MY_PROFILE.SUCCEED,
      data: user,
    };
  }

  // 내 프로필 수정
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  async updateProfile(
    @UserInfo() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponse<boolean>> {
    const userId = user.id;
    await this.usersService.updateUserProfile(user, updateProfileDto);

    return {
      statusCode: HttpStatus.OK,
      message: USER_MESSAGES.UPDATE_MY_PROFILE.SUCCEED,
      data: true,
    };
  }

  // 비밀번호 수정
  @UseGuards(ProviderGuard)
  @AllowedProviders('local')
  @Patch('me/password')
  async updatePassword(
    @UserInfo() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ApiResponse<boolean>> {
    const userId = user.id;
    await this.usersService.updatePassword(userId, updatePasswordDto);

    return {
      statusCode: HttpStatus.OK,
      message: USER_MESSAGES.UPDATE_PASSWORD.SUCCEED,
      data: true,
    };
  }

  // 닉네임 중복 확인(이거 아마 auth에서 쓸거 같은데 왜 여기서??)
  @Post('nicknames/check-duplicate')
  async isAvailableNickname(@Body() checkNicknameDto: CheckNicknameDto) {
    const isAvailable = await this.usersService.isAvailableNickname(checkNicknameDto);

    return {
      statusCode: HttpStatus.OK,
      message: USER_MESSAGES.NICKNAME.SUCCEED,
      data: isAvailable,
    };
  }
}
