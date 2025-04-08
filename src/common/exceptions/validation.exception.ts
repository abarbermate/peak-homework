import { HttpException, ValidationError } from '@nestjs/common';

export class ValidationException extends HttpException {
  errors: ValidationError[];
  constructor(message: string, errors: ValidationError[]) {
    super(message, 400);
    this.errors = errors;
  }
}
