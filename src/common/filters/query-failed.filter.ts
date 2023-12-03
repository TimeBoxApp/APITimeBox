import { QueryFailedError } from 'typeorm';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = 400;

    // Send the response with a detailed error message
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message
    });
  }
}
