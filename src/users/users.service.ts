import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User> 
    ){}

    async insertOne(username: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = new User()
        user.name = username
        user.email = email
        user.password = hashedPassword

        return await this.userRepository.save(user)
    }
}
