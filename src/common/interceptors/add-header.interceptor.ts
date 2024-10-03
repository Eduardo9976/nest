import {CallHandler, ExecutionContext, NestInterceptor} from "@nestjs/common";

export class AddHeaderInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler) {
      // poderia ser getResponse ou getRequest
    const response = context.switchToHttp().getResponse()

    response.setHeader('X-Custom-Header', 'Hello World')

    return next.handle()
  }

}
