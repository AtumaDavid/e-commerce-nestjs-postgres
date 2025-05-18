import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() signupUser: UserSignUpDto,
  ): Promise<{ UserData: UserEntity }> {
    return { UserData: await this.usersService.signup(signupUser) };
  }

  @Post('signin')
  async signin(@Body() userSignin: UserSignInDto): Promise<{
    accessToken: string;
    UserData: UserEntity;
  }> {
    const UserData = await this.usersService.signin(userSignin);
    const accessToken = await this.usersService.getAccessToken(UserData);

    return { accessToken, UserData };
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(+id);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
