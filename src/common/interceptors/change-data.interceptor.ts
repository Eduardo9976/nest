import {CallHandler, ExecutionContext, NestInterceptor} from "@nestjs/common";
import {map} from "rxjs";

// nem estou usando, só exemplo mesmo.
export class ChangeDataInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            map(data => {

                if(Array.isArray(data)) {
                    return {
                        data: data,
                        count: data.length
                    }
                }

                return data
            })
        )
    }
}
