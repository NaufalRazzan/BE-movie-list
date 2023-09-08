import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class InsertUserDto{
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}