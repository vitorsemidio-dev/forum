import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

interface ChooseQuestionBestAnswerUseCaseInput {
  authorId: string
  answerId: string
}

interface ChooseQuestionBestAnswerUseCaseOutput {
  question: Question
}

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
      throw new Error('Question not found')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toValue() !== authorId) {
      throw new Error('Not allowed.')
    }

    question.bestAnswerId = new UniqueEntityId(answerId)

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
