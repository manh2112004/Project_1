import { ValueObject } from "../common/ValueObject";
interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new Error("Email không được để trống.");
    }
    const cleanEmail = value.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Định dạng email không hợp lệ.");
    }
    return new Email({ value: cleanEmail });
  }
}
