import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

interface EditAnswerUseCaseInput {
  authorId: string
  answerId: string
  content: string
}

interface EditAnswerUseCaseOutput {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toValue() !== authorId) {
      throw new Error('Not allowed.')
    }

    answer.content = content

    await this.answersRepository.save(answer)

    return {
      answer,
    }
  }
}
