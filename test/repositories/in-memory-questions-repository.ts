import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id.toValue() === id)
    this.items.splice(index, 1)
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }
}
