import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id.toValue() === id)
    this.items.splice(index, 1)
    await this.questionAttachmentsRepository.deleteManyByQuestionId(id)
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async save(question: Question) {
    const index = this.items.findIndex(
      (item) => item.id.toValue() === question.id.toValue(),
    )
    this.items[index] = question
    const getNewItems = question.attachments.getNewItems()
    const getRemovedItems = question.attachments.getRemovedItems()
    await this.questionAttachmentsRepository.createMany(getNewItems)
    await this.questionAttachmentsRepository.deleteMany(getRemovedItems)
  }
}
