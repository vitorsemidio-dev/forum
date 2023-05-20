import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found.error'

interface DeleteAnswerUseCaseInput {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseOutput = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError('Answer not found.'))
    }

    if (answer.authorId.toValue() !== authorId) {
      return left(new NotAllowedError('Not allowed.'))
    }

    await this.answersRepository.delete(answerId)

    return right({})
  }
}
