import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async GetAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async GetUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  async CreateUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() createUserDto: LoginDto) {
    return this.usersService.login(createUserDto);
  }
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    return this.usersService.refreshToken(token);
  }

  @Patch(':id')
  async UpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async DeleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
