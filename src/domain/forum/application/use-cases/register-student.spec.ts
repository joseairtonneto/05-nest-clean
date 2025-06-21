import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'doe123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ student: inMemoryStudentsRepository.items[0] })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'doe123',
    })

    const isPasswordValid = await fakeHasher.compare(
      'doe123',
      inMemoryStudentsRepository.items[0].password,
    )

    expect(result.isRight()).toBe(true)
    expect(isPasswordValid).toBe(true)
  })
})
