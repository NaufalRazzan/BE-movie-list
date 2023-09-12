import { IsNotEmpty, IsString, IsEmail, validate } from "class-validator";

export class InsertUserDto{
    @IsNotEmpty({message: 'username cannot be empty'})
    @IsString({message: `'username' must be type of valid string`})
    username: string

    @IsNotEmpty({message: 'email cannot be empty'})
    @IsEmail({}, {message: `'email' must be type of valid email`})
    email: string;

    @IsNotEmpty({message: 'role cannot be empty'})
    @IsString({message: `'role' must be type of valid string`})
    role: string

    @IsNotEmpty({message: 'password cannot be empty'})
    @IsString({message: `'password' must be type of valid string`})
    password: string;
}

export class SignInDto{
    @IsNotEmpty({message: 'email cannot be empty'})
    @IsEmail({}, {message: `'email' must be type of valid email`})
    email: string

    @IsNotEmpty({message: 'password cannot be empty'})
    @IsString({message: `'password' must be type of valid string`})
    password: string
}