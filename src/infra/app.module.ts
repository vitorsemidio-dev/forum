import { EnvModule } from '@/infra/env/env.module'
import { AllExceptionFilter } from '@/infra/filters/all-exception.filter'
import { HttpModule } from '@/infra/http/http.module'
import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

@Module({
  imports: [EnvModule, HttpModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
