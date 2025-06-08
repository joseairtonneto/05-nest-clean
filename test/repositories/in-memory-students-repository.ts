import { Student } from '@/domain/forum/enterprise/entities/student'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string) {
    const student = this.items.find(item => item.email === email)

    return student ?? null
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
