import { Module } from '@nestjs/common';
import { AdminController, IndicatorsController } from './indicators.controller';
import { IndicatorsService } from './indicators.service';

@Module({
  controllers: [IndicatorsController, AdminController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
