import {
  CanActivate, Body, Controller, ExecutionContext, Get, Injectable, Param, Put, Query, UseGuards,
} from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { IndicatorsService } from './indicators.service';

export class UpdateIndicatorDto {
  @IsNumber() value: number;
  @IsString() @Matches(/^\d{4}(-\d{2}){0,2}$/, { message: 'periodDate debe ser AAAA, AAAA-MM o AAAA-MM-DD' })
  periodDate: string;
  @IsOptional() @IsBoolean() demo?: boolean;
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const token = process.env.ADMIN_TOKEN;
    const sent = ctx.switchToHttp().getRequest().headers['x-admin-token'];
    return !!token && token.length >= 8 && sent === token;
  }
}

@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly svc: IndicatorsService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':code/history')
  history(@Param('code') code: string, @Query('range') range = '30d') {
    return this.svc.history(code.toUpperCase(), range);
  }
}

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly svc: IndicatorsService) {}

  @Put('indicators/:code')
  update(@Param('code') code: string, @Body() dto: UpdateIndicatorDto) {
    return this.svc.updateManual(code.toUpperCase(), dto);
  }
}
