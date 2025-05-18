import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (
        !authHeader ||
        isArray(authHeader) ||
        !authHeader.startsWith('Bearer ')
      ) {
        // No token provided, just continue
        return next();
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
      }

      const { id } = <JwtPayload>jwt.verify(token, secret);

      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        console.error('Invalid user ID in token:', id);
        return next();
      }

      const currentUser = await this.userService.findOne(userId);
      req.currentUser = currentUser;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      next();
    }
  }
}

interface JwtPayload {
  id: string;
}
