import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtPayload, verify } from 'jsonwebtoken';

import { Request } from 'express';

// Extend Express Request type to allow user property
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new InvalidCredentialsException('Missing Authorization header');
    }
    if (!authHeader.startsWith('Bearer ')) {
      throw new InvalidCredentialsException('Invalid Authorization format');
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = verify(
        token,
        this.configService.get<string>('JWT_SECRET', 'changeme'),
      ) as JwtPayload;
      request.user = payload;
      return true;
    } catch (e) {
      throw new InvalidCredentialsException('Invalid or expired token');
    }
  }
}
