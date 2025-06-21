import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async findById(id: string) {
    const attachment = this.items.find(item => item.id.toString() === id)

    return attachment ?? null
  }

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }

  async save(attachment: Attachment) {
    const itemIndex = this.items.findIndex(item => item.id === attachment.id)

    this.items[itemIndex] = attachment
  }

  async delete(attachment: Attachment) {
    const itemIndex = this.items.findIndex(item => item.id === attachment.id)

    this.items.splice(itemIndex, 1)
  }
}
