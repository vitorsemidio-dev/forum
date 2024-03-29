import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors//resource-not-found.error'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface EditQuestionUseCaseInput {
  authorId: string
  attachmentIds: string[]
  questionId: string
  content: string
  title: string
}

type EditQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    attachmentIds,
    questionId,
    content,
    title,
  }: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError('Question not found.'))
    }

    if (question.authorId.toValue() !== authorId) {
      return left(new NotAllowedError('Not allowed.'))
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const attachments = QuestionAttachment.createFromIds({
      attachmentIds,
      questionId: question.id,
    })

    questionAttachmentList.update(attachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
