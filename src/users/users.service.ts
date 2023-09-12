import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from 'src/models/entity/user.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User> 
    ){}

    async insertOne(user: User): Promise<User> {
        return await this.userRepository.save(user)
    }

    async findUser(email: string): Promise<User>{
        return await this.userRepository.findOne({
            where: {
                email: email
            },
        })
    }
}
