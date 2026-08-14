import { Entity } from "./Entity";
import { IDomainEvent } from "./IDomainEvent";
export abstract class AggregateRoot extends Entity {
  // Danh sách lưu trữ tạm thời các sự kiện nghiệp vụ xảy ra bên trong thực thể
  private _domainEvents: IDomainEvent[] = [];
  // Dùng để rút sự kiện ra mang đi xử lý (Chỉ gọi ở tầng Use Case)
  public pullDomainEvents(): IDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = []; // Hành động then chốt: Dọn sạch hòm thư!
    return events;
  }

  // Dùng để ghi nhận sự kiện mới (Chỉ gọi bên trong các Entity con)
  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }
}
