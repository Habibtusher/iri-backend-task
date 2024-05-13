/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
// import { LoginDto } from './users.dto';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from 'src/helpers/token';
import { LoginDto } from './users.dto';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class UsersService {
  constructor(
    private database: DatabaseService,
    private redisService: RedisService,
  ) {}
  async getAllUsers() {
    return this.database.user.findMany({});
  }

  async getUserById(id: number) {
    const user = await this.database.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async createUser(createUserDto: Prisma.UserCreateInput) {
    const { name, password, email, country } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashPassword,
      country,
    };
    const res = await this.database.user.create({ data: newUser });
    const newAccessToken = createToken(
      {
        id: res?.id,
        email: res?.email,
      },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN,
    );
    return {
      access_token: newAccessToken,
      user: {
        name: res.name,
        email: res.email,
        country: res.country,
      },
    };
  }

  async updateUser(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.database.user.update({ where: { id }, data: updateUserDto });
  }

  async deleteUser(id: number) {
    await this.getUserById(id);
    return this.database.user.delete({ where: { id } });
  }
  async login(user: LoginDto) {
    const exUser = await this.database.user.findUnique({
      where: { email: user.email },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const isPasswordMatched = await bcrypt.compare(
      user.password,
      exUser.password,
    );
    if (isPasswordMatched) {
      const newAccessToken = createToken(
        {
          id: exUser?.id,
          email: exUser?.email,
        },
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRES_IN,
      );
      const redisClient = this.redisService.getClient();
      await redisClient.set(newAccessToken, JSON.stringify(user), 'EX', 300);
      return {
        access_token: newAccessToken,
        user: {
          name: exUser.name,
          email: exUser.email,
          country: exUser.country,
        },
      };
    }
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Password missmatch!',
    });
  }
  async refreshToken(authorization: string) {

    if (!authorization) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const verifiedToken = verifyToken(authorization, process.env.JWT_SECRET);
    if (verifiedToken) {
      const exUser = await this.database.user.findUnique({
        where: { email: verifiedToken.email },
      });
      const newAccessToken = createToken(
        {
          id: exUser?.id,
          email: exUser?.email,
        },
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRES_IN,
      );
      return {
        access_token: newAccessToken,
      };
    }
  }
}
