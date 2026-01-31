import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsException } from '../../common/exceptions/invalid-credentials.exception';
import { EmailAlreadyExistsException } from '../../common/exceptions/email-already-exists.exception';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async signup(dto: any) {
    const exists = await this.userRepository.findWithEmail(dto.email);
    if (exists) {
      throw new EmailAlreadyExistsException(dto.email);
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hashed });
    const saved = await this.userRepository.save(user);

    const { password, ...result } = saved;
    return result;
  }

  async login(dto: any) {
    const user = await this.userRepository.findWithEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new InvalidCredentialsException();
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'changeme',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        },
      );
    });
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async findById(id: string) {
    return await this.userRepository.findOne(id);
  }
}
