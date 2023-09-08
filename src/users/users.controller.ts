import { Controller, Post, Body, UsePipes, ValidationPipe, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { InsertUserDto, SignInDto } from 'src/models/user.dto';
import * as bcrypt from 'bcrypt'

@Controller('users')
export class UsersController {
    constructor(private readonly userServise: UsersService){}

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

            const result = await this.userServise.insertOne(username, email, role, password)

            return {
                message: 'new user created',
                data: result
            }
        } catch (error) {
            if(error instanceof HttpException){
                throw error
            }
            throw new HttpException('Failed to insert new user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('signin')
    async signin(@Body() payload: SignInDto, @Res() res: Response){
        if(!payload){
            throw new HttpException('request body failed to parsed', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const { email, password } = payload

        if(!email || !password){
            throw new HttpException('empty request body fields', HttpStatus.BAD_REQUEST)
        }

        const user = await this.userServise.findOne(email)
        if(!user){
            throw new HttpException('user not found', HttpStatus.NOT_FOUND)
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            throw new HttpException('incorrect password', HttpStatus.UNAUTHORIZED)
        }

        return res.status(HttpStatus.OK).json({message: 'welcome ' + user.name})
    }
}
