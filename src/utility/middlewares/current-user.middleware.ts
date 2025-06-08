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
  // Inject the UsersService to fetch user data from the database
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Step 1: Extract the Authorization header from the request
      // Check both lowercase 'authorization' and capitalized 'Authorization'
      const authHeader = req.headers.authorization || req.headers.Authorization;
      // Step 2: Check if the header is present and starts with 'Bearer '
      if (
        !authHeader ||
        isArray(authHeader) ||
        !authHeader.startsWith('Bearer ')
      ) {
        // If any validation fails, just continue without setting currentUser
        // This allows the request to proceed - some endpoints might not require auth
        // No token provided, just continue
        next();
        return;
      }

      try {
        // Step 3: Extract the token from the header
        // Split the header to get the token part
        const token = authHeader.split(' ')[1];

        // Step 4: Verify the token
        // Use the secret key from environment variables to verify the token
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
          throw new Error('ACCESS_TOKEN_SECRET is not defined');
        }

        // Step 5: Verify the token and extract the user ID from the payload
        // If the token is invalid, this will throw an error
        const { id } = <JwtPayload>jwt.verify(token, secret);

        // Step 6: Fetch the user from the database using the user ID
        // Convert the string ID to a number (assuming your database uses numeric IDs)
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
          console.error('Invalid user ID in token:', id);
          return next();
        }

        // Step 7: Fetch the complete user data from the database
        // This gives us the full user entity with all properties
        const currentUser = await this.userService.findOne(userId);

        // Step 8: Attach the user to the request object
        // Now any subsequent middleware or route handler can access req.currentUser
        req.currentUser = currentUser;

        // Step 9: Continue to the next middleware or route handler
        next();
      } catch (error) {
        req.currentUser = undefined; // Ensure currentUser is undefined if token verification fails
        console.error('Token verification failed:', error.message);
        next();
      }
    } catch (error) {
      console.error('Token verification error:', error.message);
      next();
    }
  }
}

interface JwtPayload {
  id: string;
}
