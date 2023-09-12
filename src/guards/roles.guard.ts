import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate{
    private getRolesFromHeader(request: Request): string | undefined{
        const role = request.headers?.['role']

        return role ? role as string : undefined
    }

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const role = this.getRolesFromHeader(request)

        if(role === undefined){
            throw new HttpException('"role" header not found', HttpStatus.BAD_REQUEST)
        }

        if(role !== 'admin'){
            throw new HttpException('you are not authorized to access this resources', HttpStatus.FORBIDDEN)
        }

        return true
    }
}