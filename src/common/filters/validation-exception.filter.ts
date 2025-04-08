import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { ValidationException } from '@app/common/exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errors = exception.errors.map((error) => {
      return {
        property: error.property,
        value: error.value,
        constraints: error.constraints,
        children: error.children,
      };
    });
    response.status(status).json({
      statusCode: status,
      type: 'VALIDATION_EXCEPTION',
      errors,
      request: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    });
  }
}
