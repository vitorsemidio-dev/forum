import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors//resource-not-found.error'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionUseCaseInput {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
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
