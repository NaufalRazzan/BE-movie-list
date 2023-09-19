import { Controller, Post, Body, UsePipes, ValidationPipe, HttpStatus, HttpException, HttpCode, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InsertUserDto, SignInDto } from 'src/models/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sign In and Sign Up')
@Controller('auth')
export class AuthController {
   constructor(private authservice: AuthService){}

    @Post('signup')
    @UsePipes(new ValidationPipe({transform: true}))
    async signup(@Body() body: InsertUserDto){
        try {
            if(!body){
                throw new HttpException('request body failed to parsed', HttpStatus.UNPROCESSABLE_ENTITY)
            }

            const { username, email, role, password } = body

            if(!username || !email || !role || !password){
                throw new HttpException('empty request body fields', HttpStatus.BAD_REQUEST)
            }

            const result = await this.authservice.signup(username, email, role, password)

            return {
                message: 'new user created',
                data: result
            }
        } catch (error) {
            throw error
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @UsePipes(new ValidationPipe({transform: true}))
    async signin(@Body() payload: SignInDto){
        try {
            if(!payload){
                throw new HttpException('request body failed to parsed', HttpStatus.UNPROCESSABLE_ENTITY)
            }
    
            const { email, password } = payload
            if(!email || !password){
                throw new HttpException('empty request body fields', HttpStatus.BAD_REQUEST)
            }
    
            return await this.authservice.signin(email, password)
        } catch (error) {
            throw error
        }
    }

    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'Logged in'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @HttpCode(HttpStatus.OK)
    @Get('/test')
    @UseGuards(AuthGuard)
    async testApi(){
        return {
            message: 'welcome to main page'
        }
    }
}
