import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { DtoValidationException } from '../exceptions/dto.validation.exception';

const mapErrors = (errors: ValidationError[]) => {
  return Object.fromEntries(
    errors.map(({ property, constraints, children }) => {
      if (children && children.length > 0) {
        return [property, mapErrors(children)];
      } else {
        return [
          property,
          [Object.values(constraints)[0], Object.keys(constraints)[0]],
        ];
      }
    })
  );
};

export const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) => {
    return new DtoValidationException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: mapErrors(errors),
    });
  },
});
