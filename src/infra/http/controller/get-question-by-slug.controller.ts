import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionPresenter } from '@/infra/http/presenters/question.presenter'
import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({
      slug,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(result.value.message)
        default:
          throw new Error('Unexpected error')
      }
    }

    const question = result.value.question

    return QuestionPresenter.toHTTP(question)
  }
}
