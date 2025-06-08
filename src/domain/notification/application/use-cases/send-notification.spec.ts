import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      title: 'Example notification',
      content: 'example content',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
