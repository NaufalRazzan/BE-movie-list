import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from 'src/models/user.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User> 
    ){}

    async insertOne(username: string, email: string, role: string, password: string): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
        
            const user = new User()
            user.name = username
            user.email = email
            user.role = role
            user.password = hashedPassword

            return await this.userRepository.save(user)
        } catch (err) {
            if(err instanceof QueryFailedError && err.message.includes('duplicate key value violates unique constraint')){
                throw new HttpException('Username or email is already in use', HttpStatus.CONFLICT)
            }
            throw err
        }
    }

    async findOne(email: string): Promise<User>{
        return await this.userRepository.findOne({
            where: {
                email: email
            },
        })
    }
}
