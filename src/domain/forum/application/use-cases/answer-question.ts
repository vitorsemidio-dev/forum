import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  attachmentIds: string[]
  instructorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  undefined,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    attachmentIds,
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    answer.attachments = AnswerAttachmentList.createFromIds({
      attachmentIds,
      answerId: answer.id,
    })

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
