import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { Public } from '@/infra/auth/public'
import { QuestionPresenter } from '@/infra/http/presenters/question.presenter'
import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { z } from 'zod'

const fetchRecentQuestionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
})

type FetchRecentQuestionsQuery = z.infer<typeof fetchRecentQuestionsQuerySchema>

@Controller('/questions')
@Public()
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Query() query: FetchRecentQuestionsQuery) {
    const result = await this.fetchRecentQuestionsUseCase.execute({
      page: query.page || 1,
    })

    if (result.isLeft()) {
      throw new Error('Unexpected error')
    }

    const questions = result.value.questions

    return questions.map(QuestionPresenter.toHTTP)
  }
}
