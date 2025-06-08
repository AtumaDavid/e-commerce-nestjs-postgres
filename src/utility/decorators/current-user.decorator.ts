import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // The decorator function receives two parameters:
  // - data: any custom data passed to the decorator (we don't use it here, hence 'never')
  // - ctx: ExecutionContext provides access to the current request/response context
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);

/**
 * 1. HTTP Request arrives
   ↓
2. CurrentUserMiddleware runs (extracts JWT, fetches user)
   ↓
3. req.currentUser = UserEntity (middleware sets this)
   ↓
4. Route handler with @CurrentUser() decorator
   ↓
5. Decorator reads req.currentUser and injects it as parameter
   ↓
6. Your method receives the user automatically
 * 
 */
