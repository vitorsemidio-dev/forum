import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

interface DeleteQuestionUseCaseInput {
  authorId: string
  questionId: string
}

interface DeleteQuestionUseCaseOutput {}

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toValue() !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.questionsRepository.delete(questionId)

    return {}
  }
}
