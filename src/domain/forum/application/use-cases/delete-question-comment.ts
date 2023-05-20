import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found.error'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId,
    )

    if (!questionComment) {
      return left(new ResourceNotFoundError('Question comment not found.'))
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError('Not allowed'))
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
