import { CreateAccountUseCase } from '@/domain/forum/application/use-cases/create-account.use-case'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post('')
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createAccountBodySchema))
    body: CreateAccountBodySchema,
  ) {
    const result = await this.createAccountUseCase.execute(body)

    if (result.isLeft()) {
      throw result.value
    }
  }
}
