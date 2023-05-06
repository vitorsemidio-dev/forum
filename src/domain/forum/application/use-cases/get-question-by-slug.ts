import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

interface GetQuestionBySlugUseCaseInput {
  slug: string
}

interface GetQuestionBySlugUseCaseOutput {
  question: Question
}

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseInput): Promise<GetQuestionBySlugUseCaseOutput> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      throw new Error('Question not found')
    }

    return { question }
  }
}
