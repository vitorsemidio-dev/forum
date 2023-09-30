import { AuthenticateUseCase } from '@/domain/forum/application/use-cases/authenticate.use-case'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const authenticationBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticationBodySchema = z.infer<typeof authenticationBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticationBodySchema))
  async handle(@Body() body: AuthenticationBodySchema) {
    const result = await this.authenticateUseCase.execute(body)
    if (result.isLeft()) {
      throw result.value
    }

    return {
      access_token: result.value.accessToken,
    }
  }
}
