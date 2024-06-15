import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class userDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class updateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly name?: string;
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly lastName?: string;
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly userName?: string;
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly role?: userRole;
}

enum userRole {
  DEVELOPER = 'desarrollador',
  ADMIN = 'administrador',
}
