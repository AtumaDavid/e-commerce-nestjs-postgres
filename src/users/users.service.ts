import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  // Injects TypeORM repository for UserEntity to enable database operations on the user table.
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  // user signup method
  async signup(signupUser: UserSignUpDto): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(signupUser.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // hash password before saving
    signupUser.password = await hash(signupUser.password, 10);
    let user = this.usersRepository.create(signupUser);
    return await this.usersRepository.save(user);
  }

  // user signin method
  async signin(userSignin: UserSignInDto): Promise<UserEntity> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userSignin.email })
      .getOne();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const matchPassword = await compare(userSignin.password, user.password);
    if (!matchPassword) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async getAccessToken(user: UserEntity): Promise<string> {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
