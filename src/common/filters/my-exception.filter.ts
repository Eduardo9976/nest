import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Injectable} from "@nestjs/common";

@Injectable()
@Catch(BadRequestException)
export class MyExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        response
            .status(exception.statusCode)
            .json({
                statusCode: exception.statusCode,
                timestamp: new Date().toISOString(),
                mensagem: exception.message + ' customizada',
            })

    }
}
