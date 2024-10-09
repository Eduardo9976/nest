import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const UrlParam = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();

  return request.url
})

