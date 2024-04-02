import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '../entities/user.entity';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2, 24)
    @Transform(({ value }) => value.trim())
    name: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    username: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    country: string;

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;
}
