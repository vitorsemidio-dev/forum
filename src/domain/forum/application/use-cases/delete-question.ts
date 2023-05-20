import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found.error'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'

interface DeleteQuestionUseCaseInput {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError('Question not found.'))
    }

    if (question.authorId.toValue() !== authorId) {
      return left(new NotAllowedError('Not allowed.'))
    }

    await this.questionsRepository.delete(questionId)

    return right({})
  }
}
