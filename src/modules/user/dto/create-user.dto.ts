import { IsEmail, IsLowercase, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsLowercase()
  email: string;

  @MinLength(6)
  password: string;
}
