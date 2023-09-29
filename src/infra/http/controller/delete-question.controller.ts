import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deletequestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    const result = await this.deletequestionUseCase.execute({
      questionId: id,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(result.value.message)
        case NotAllowedError:
          throw new ForbiddenException(result.value.message)
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}
