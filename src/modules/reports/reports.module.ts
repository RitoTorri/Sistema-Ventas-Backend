import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
