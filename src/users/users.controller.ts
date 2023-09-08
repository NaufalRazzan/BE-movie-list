import { Controller, Post, Body, UsePipes, ValidationPipe, HttpException, HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import { InsertUserDto } from 'src/models/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userServise: UsersService){}

    @Post('signup')
    @UsePipes(new ValidationPipe({transform: true}))
    async signup(@Body() body: InsertUserDto){
        try {
            if(!body){
                throw new HttpException('request body failed to parsed', HttpStatus.BAD_REQUEST)
            }

            const { username, email, password } = body

            if(!username || !email || !password){
                throw new HttpException('empty request body fields', HttpStatus.BAD_REQUEST)
            }

            const result = await this.userServise.insertOne(username, email, password)
            if(result instanceof Error){
                throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR)
            }

            return {
                message: 'new user created',
                data: result
            }
        } catch (error) {
            throw new HttpException('Failed to insert new user', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}
