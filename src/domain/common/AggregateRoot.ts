import { Entity } from "./Entity";

// Định nghĩa interface cơ bản cho các Sự kiện Domain (Domain Events)
export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): string;
}

export abstract class AggregateRoot extends Entity {
  // Danh sách lưu trữ tạm thời các sự kiện nghiệp vụ xảy ra bên trong thực thể
  private _domainEvents: IDomainEvent[] = [];

  // Getter để bên ngoài (như Repository hoặc Event Dispatcher) lấy danh sách sự kiện ra chạy
  public get domainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Đăng ký một sự kiện nghiệp vụ mới
   * Hàm này có phạm vi protected để chỉ bản thân AggregateRoot con được quyền phát event
   */
  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  /**
   * Xóa toàn bộ danh sách sự kiện
   * Được gọi sau khi Use Case/Repository đã lưu dữ liệu và gửi các event này đi thành công
   */
  public clearEvents(): void {
    this._domainEvents = [];
  }
}
