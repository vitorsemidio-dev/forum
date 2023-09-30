import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors//resource-not-found.error'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError('Answer comment not found.'))
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError('Not allowed'))
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
