import { EnvModule } from '@/infra/env/env.module'
import { HttpModule } from '@/infra/http/http.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [EnvModule, HttpModule],
})
export class AppModule {}
