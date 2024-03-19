import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CognitoService } from '@app/aws';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(forwardRef(() => CognitoService))
    private readonly cognitoService: CognitoService
  ) {}

  async use(req: Request | any, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];

    let user = null;

    if (!bearerHeader || !accessToken) {
      return next();
    }

    try {
      user = await this.cognitoService.getUser(accessToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
    

    if (user) {
      req.user = this.cognitoService.parseUser(accessToken, user);
    }

    next();
  }
}
