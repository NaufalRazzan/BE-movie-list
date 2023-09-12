import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from 'src/models/user.entity';
import { QueryFailedError, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userservice: UsersService,
        private jwtservice: JwtService
        ){}

    async signup(username: string, email: string, role: string, password: string): Promise<User>{
        try{
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = new User()
            user.name = username
            user.email = email
            user.role = role
            user.password = hashedPassword

            return await this.userservice.insertOne(user)
        } catch(err){
            if(err instanceof QueryFailedError && err.message.includes('duplicate key value violates unique constraint')){
                throw new HttpException('username or email is already in use', HttpStatus.CONFLICT)
            }
            throw err
        }
    }

    async signin(email: string, password: string): Promise<{token: string, msg: string}>{
        const user =  await this.userservice.findUser(email)
        if(!user){
            throw new HttpException('incorrect email or password', HttpStatus.UNAUTHORIZED)
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            throw new HttpException('incorrect email or password', HttpStatus.UNAUTHORIZED)
        }

        const payload = { sub: user.id, username: user.name }
        const access_token = await this.jwtservice.signAsync(payload, { secret: process.env.SECRET_KEY })

        return Promise.resolve({token: access_token, msg: 'welcome'})
    }
}
