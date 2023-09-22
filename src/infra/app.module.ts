import { HttpModule } from '@/infra/http/http.module'
import { Module } from '@nestjs/common'
import { EnvModule } from './env/env.module'

@Module({
  imports: [EnvModule, HttpModule],
})
export class AppModule {}
