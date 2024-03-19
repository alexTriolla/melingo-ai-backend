import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ValidationError } from 'class-validator';
import { BaseError as BaseErrorSequelize, ValidationErrorItem } from 'sequelize';

import { DtoValidationException } from '../exceptions/dto.validation.exception';
import { TranslatedException, configuration } from '@app/common';

type ValidationErrorValue = [string, string] | object;

function safeJsonParse(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

/**
 * Parses a validation error item and returns the corresponding error message.
 * @param errorKey The key of the error.
 * @param validationKey The key of the validation.
 * @param validationType The type of the validation.
 * @returns The error message.
 */
const parseValidationErrorItem = (
  errorKey: string,
  validationKey: string,
  validationType: string
): string => {
  const i18n = I18nContext.current();

  const [key, args] = String(validationKey).split('|');

  const parsedArgs = safeJsonParse(args);
  const neutralArgs = safeJsonParse(key);
  const translateKey = neutralArgs?.['message'] || validationType;

  return args
    ? i18n.t(key, { args: { ...parsedArgs, property: errorKey } })
    : i18n.t(`validations.${translateKey}`, {
        args: { ...neutralArgs, property: errorKey },
      });
};

/**
 * Transforms Sequelize errors into a more readable format.
 * @param errors - The original error object.
 * @param exception - The Sequelize exception object.
 * @returns The transformed error object.
 */
const transformSequelizeErrors = (
  errors: Record<string, string>,
  exception: BaseErrorSequelize
) => {
  const i18n = I18nContext.current();

  const validationErrors = exception['errors'] as ValidationErrorItem[];

  if (validationErrors) {
    errors = validationErrors.reduce(
      (acc, err) => {
        acc[err.path] = i18n.t(`validations.Db.${err.path}_${err.validatorKey}`);
        return acc;
      },
      {} as Record<string, string>
    );
  }

  return errors;
};

/**
 * Transforms the validation errors from a DtoValidationException into a more readable format.
 * @param errors - The existing errors object.
 * @param exception - The DtoValidationException containing the validation errors.
 * @returns The transformed errors object.
 */
const transformDtoValidationErrors = (
  errors: Record<string, string>,
  validationErrors: ValidationError[]
) => {
  if (validationErrors) {
    errors = Object.entries(validationErrors).reduce(
      (acc, [errorKey, value]: [string, ValidationErrorValue]) => {
        if (Array.isArray(value) && value.length === 2) {
          const [validationKey, validationType] = value;

          acc[errorKey] = parseValidationErrorItem(errorKey, validationKey, validationType);
        } else {
          const errorKeys = Object.keys(value);

          acc[errorKey] = Object.values(value).reduce(
            (acc, err, index) => {
              if (Array.isArray(err)) {
                const [validationKey, validationType] = err;

                acc[errorKeys[index]] = parseValidationErrorItem(
                  errorKey,
                  validationKey,
                  validationType
                );

                return acc;
              }

              const errKey = Object.keys(err)[0];
              const [validationKey, validationType] = err[errKey];

              acc[`${index}.${errKey}`] = parseValidationErrorItem(
                errKey,
                validationKey,
                validationType
              );

              return acc;
            },
            {} as Record<string, string>
          );
        }

        return acc;
      },
      {} as Record<string, any>
    );
  }

  return errors;
};

/**
 * Custom exception filter that handles all exceptions thrown in the application.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const stack = status === HttpStatus.INTERNAL_SERVER_ERROR ? exception['stack'] : undefined;
    let sequelizeErr = null;

    let errors: Record<string, string> = undefined;

    if (exception instanceof DtoValidationException) {
      errors = transformDtoValidationErrors(errors, exception.getResponse()['errors']);
    }

    if (exception instanceof BaseErrorSequelize) {
      const sequelizeErrors = transformSequelizeErrors(errors, exception);
      const firstError = Object.keys(sequelizeErrors)[0];

      sequelizeErr = sequelizeErrors[firstError];
    }

    let msg = exception['message'] ?? exception;

    if (exception instanceof TranslatedException) {
      msg = I18nContext.current().t(`validations.${exception['message']}`);
    }

    response.status(status).json({
      statusCode: status,
      message: sequelizeErr ?? msg,
      code: exception['code'],
      errors: errors,
      timestamp: new Date().toISOString(),
      ...(configuration().development && { path: request.url }),
      ...(stack && configuration().development && { stack }),
    });
  }
}
