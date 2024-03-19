import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '@app/types';

export const getUserByContext = (context: ExecutionContext): IUser => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getUserByContext(context)
);
