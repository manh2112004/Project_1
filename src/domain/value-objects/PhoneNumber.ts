import { ValueObject } from "../common/ValueObject";
interface PhoneNumberProps {
  value: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(value?: string): PhoneNumber | undefined {
    if (value === undefined || value === null || value.trim().length === 0) {
      return undefined; // Số điện thoại là tùy chọn (optional)
    }
    const cleanPhone = value.trim();
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/; // Validate đầu số Việt Nam
    if (!phoneRegex.test(cleanPhone)) {
      throw new Error("Số điện thoại không đúng định dạng Việt Nam.");
    }
    return new PhoneNumber({ value: cleanPhone });
  }
}
