import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const ReqDataParam = createParamDecorator(
    // esse data é o que recebo no decorator @ReqDataParam('data') e poderia ser qlq tipo
    (data: keyof Request, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();

        return request[data]
    }
)

