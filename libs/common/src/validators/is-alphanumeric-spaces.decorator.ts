import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegexLettersSpacesAndNumbers } from '../constants';

export type AlphaNumericValidationOptions = ValidationOptions & {
  optional?: boolean;
};

export function IsAlphanumericSpaces(
  validationOptions?: AlphaNumericValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsAlphanumericSpacesConstraints,
      constraints: [validationOptions],
    });
  };
}

@ValidatorConstraint({ name: 'IsAlphanumericSpaces' })
export class IsAlphanumericSpacesConstraints
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return (
      typeof value === 'string' &&
      RegExp(RegexLettersSpacesAndNumbers).test(value)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} can only contain letters, numbers and spaces`;
  }
}
