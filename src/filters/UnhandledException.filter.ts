import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express'

@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter{  
    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response: Response = context.getResponse()

        if(exception instanceof HttpException){
            const status = exception.getStatus()
            response.status(status).json({
                message: exception.message
            })
        }
        else{
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'error from the server',
                errors: exception.message
            })
        }
    }
}