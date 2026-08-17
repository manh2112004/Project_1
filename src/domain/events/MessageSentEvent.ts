import { IDomainEvent } from "../common/IDomainEvent";
import { SenderType } from "../constant/MessageEnums";
import { MessageAttachment } from "../entities/Message";
export class MessageSentEvent implements IDomainEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly conversationId: string,
    public readonly messageId: string,
    public readonly content: string,
    public readonly senderId: string,
    public readonly senderType: SenderType,
    public readonly metadata?: any,
    public readonly attachments?: MessageAttachment[],
  ) {
    this.occurredOn = new Date();
  }
}
