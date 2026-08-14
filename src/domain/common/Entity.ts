export abstract class Entity {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  protected _deletedAt: Date | null;

  constructor(
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this._id = id || crypto.randomUUID();
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._deletedAt = deletedAt || null;
  }
  public get id(): string {
    return this._id;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }
  public get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // Hàm nội bộ để cập nhật ngày thay đổi dữ liệu (gọi mỗi khi cập nhật state)
  protected touch(): void {
    this._updatedAt = new Date();
  }

  // Hàm xóa mềm dùng chung cho toàn bộ các thực thể
  public delete(): void {
    this._deletedAt = new Date();
    this.touch();
  }
}
