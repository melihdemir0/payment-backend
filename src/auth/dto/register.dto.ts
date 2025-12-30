import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'test123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
