export abstract class ValueObject<T extends Record<string, any>> {
  protected readonly props: T;

  constructor(props: T) {
    // Sử dụng Object.freeze để đóng băng đối tượng, đảm bảo tính bất biến (Immutability)
    this.props = Object.freeze({ ...props });
  }

  /**
   * So sánh bằng giá trị (Value Equality) giữa hai Value Object
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    // Kiểm tra xem có cùng lớp (class) khởi tạo hay không
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }

    // So sánh sâu (deep equality) các thuộc tính bên trong
    return this.deepEquals(this.props, vo.props);
  }

  private deepEquals(obj1: any, obj2: any): boolean {
    // so sánh tham chiếu bộ nhớ (Reference Equality)
    if (obj1 === obj2) return true;

    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !this.deepEquals(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }
}
