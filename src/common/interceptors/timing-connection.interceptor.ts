import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {tap} from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        // constructor() {} // poderia pegar os repositories pelo injetor
        const startTime = Date.now();

        console.log('TimingConnectionInterceptor executado ANTES');

        // await new Promise(resolve => setTimeout(resolve, 10000));

        return next.handle().pipe(
            tap((data) => {
                const finalTime = Date.now();
                const elapsedTime = finalTime - startTime;

                // console.log('também recebo os dados da resposta', data);
                console.log(
                    `TimingConnectionInterceptor: levou ${elapsedTime}ms para executar.`,
                );
            }),
        );
    }
}
