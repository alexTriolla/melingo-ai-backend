import { BadRequestException } from '@nestjs/common';

export class CognitoValidationException extends BadRequestException {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}
