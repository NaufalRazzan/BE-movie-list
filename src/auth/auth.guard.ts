import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtservice: JwtService){}

    private extractTokenFromHeader(request: Request): string | undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        
        return type == 'Bearer' ? token : undefined
    }

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if(token === undefined){
            throw new HttpException('token cannot be found', HttpStatus.UNAUTHORIZED)
        }

        try {
            const result = await this.jwtservice.verifyAsync(token, { secret: process.env.SECRET_KEY })
            request["user"] = result
        } catch {
            throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED)
        }

        return true
    }

}