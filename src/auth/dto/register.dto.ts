import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import type { Role } from '../../users/interfaces/user.interface';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(['ADMIN', 'DEVELOPER', 'INTERN'])
  role!: Role;
}