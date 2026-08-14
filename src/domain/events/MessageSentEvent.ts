import { IDomainEvent } from "../common/IDomainEvent";
import { SenderType } from "../constant/MessageEnums";

export class MessageSentEvent implements IDomainEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly conversationId: string,
    public readonly messageId: string,
    public readonly content: string,
    public readonly senderId: string,
    public readonly senderType: SenderType,
  ) {
    this.occurredOn = new Date();
  }
}
