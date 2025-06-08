import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the allowed roles from the metadata
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    // If no roles are specified, deny access
    if (!allowedRoles) {
      throw new UnauthorizedException('No roles defined for this resource');
    }

    // Get the request and the current user
    const request = context.switchToHttp().getRequest();
    const user = request?.currentUser; // Fixed typo here

    // If no user is present, deny access
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if any of the user's roles match the allowed roles
    const hasRole = user.roles.some((role: string) =>
      allowedRoles.includes(role),
    );

    if (!hasRole) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
