import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '../entities/user.entity';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @Transform(({ value }) => value.trim())
    name: string;

    @IsEmail()
    @Transform(({ value }) => value.trim())
    email: string;

    @IsString()
    @Length(3, 20)
    @Transform(({ value }) => value.trim())
    @Matches(/^\S*$/, { message: 'username must not contain whitespaces' })
    username: string;

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    country: string;

    @IsEnum(Gender)
    gender: Gender;

    @Length(6, 24)
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    password: string;

    @IsNotEmpty()
    @Length(6, 24)
    @Transform(({ value }) => value.trim())
    confirmPassword: string;
}
