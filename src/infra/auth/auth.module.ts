import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { JwtStrategy } from '@/infra/auth/jwt.strategy'
import { EnvModule } from '@/infra/env/env.module'
import { EnvService } from '@/infra/env/env.service'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule], // 👈 import EnvModule to work inject EnvService when use `registerAsync`
      inject: [EnvService],
      global: true,
      async useFactory(envService: EnvService) {
        const privateKey = envService.get('JWT_PRIVATE_KEY')
        const publicKey = envService.get('JWT_PUBLIC_KEY')
        return {
          signOptions: {
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKey, 'base64').toString('utf-8'),
          publicKey: Buffer.from(publicKey, 'base64').toString('utf-8'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
