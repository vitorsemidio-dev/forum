import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors//resource-not-found.error'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

interface EditAnswerUseCaseInput {
  attachmentIds: string[]
  authorId: string
  answerId: string
  content: string
}

type EditAnswerUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    attachmentIds,
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError('Answer not found.'))
    }

    if (answer.authorId.toValue() !== authorId) {
      return left(new NotAllowedError('Not allowed.'))
    }

    answer.content = content

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const attachments = AnswerAttachment.createFromIds({
      attachmentIds,
      answerId: answer.id,
    })

    answerAttachmentList.update(attachments)

    answer.attachments = answerAttachmentList

    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
