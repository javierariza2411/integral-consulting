import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Equals, IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ContactService } from './contact.service';

export class ContactDto {
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @IsEmail() @MaxLength(150) email: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @IsString() @MaxLength(120) company?: string;
  @IsString() @MinLength(10) @MaxLength(3000) message: string;
  @IsBoolean() @Equals(true, { message: 'Debes aceptar la política de tratamiento de datos' }) consent: boolean;
  @IsOptional() @IsString() website?: string; // honeypot
}

@Controller('contact')
export class ContactController {
  constructor(private readonly svc: ContactService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async send(@Body() dto: ContactDto) {
    if (dto.website) return { ok: true }; // bot: se ignora en silencio
    await this.svc.send(dto);
    return { ok: true };
  }
}
