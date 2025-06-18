import { IsEmail, IsLowercase, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsLowercase()
  email: string;

  @MinLength(6)
  password: string;
}
