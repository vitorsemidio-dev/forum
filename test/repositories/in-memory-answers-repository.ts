import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id.toValue() === id)
    this.items.splice(index, 1)
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async save(answer: Answer) {
    const index = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    )
    this.items[index] = answer
  }
}
