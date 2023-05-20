import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found.error'
import { Question } from '@/domain/forum/enterprise/entities/question'

interface ChooseQuestionBestAnswerUseCaseInput {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersRepositiory: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {
    const answer = await this.answersRepositiory.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError('Answer not found.'))
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      return left(new ResourceNotFoundError('Question not found.'))
    }

    if (question.authorId.toValue() !== authorId) {
      return left(new NotAllowedError('Not allowed.'))
    }

    question.bestAnswerId = new UniqueEntityId(answerId)

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
