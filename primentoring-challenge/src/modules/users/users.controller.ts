import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiBody({ type: SignupDto })
  async signup(@Body() dto: SignupDto) {
    try {
      return await this.usersService.signup(dto);
    } catch (error) {
      // Log error for debugging
      console.error('Signup error:', error);
      // Let Nest handle the error (keep correct HTTP status and CORS headers)
      throw error;
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.usersService.login(dto);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}
