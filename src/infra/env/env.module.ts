import { envSchema } from '@/infra/env/env'
import { EnvService } from '@/infra/env/env.service'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
