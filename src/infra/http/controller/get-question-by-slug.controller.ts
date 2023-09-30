import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { Public } from '@/infra/auth/public'
import { QuestionPresenter } from '@/infra/http/presenters/question.presenter'
import { Controller, Get, HttpCode, Param } from '@nestjs/common'

@Controller('/questions/:slug')
@Public()
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
      throw result.value
    }

    const question = result.value.question

    return QuestionPresenter.toHTTP(question)
  }
}
