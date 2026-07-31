// src/domain/value-objects/Gender.ts
import { ValueObject } from "../common/ValueObject";

interface GenderProps {
  value: string;
}

export class Gender extends ValueObject<GenderProps> {
  private static readonly ALLOWED_GENDERS = ["MALE", "FEMALE", "OTHER"];

  private constructor(props: GenderProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): Gender {
    if (!value || value.trim().length === 0) {
      throw new Error("Giới tính không được để trống.");
    }
    const normalizedGender = value.toUpperCase().trim();
    if (!this.ALLOWED_GENDERS.includes(normalizedGender)) {
      throw new Error("Giới tính phải là MALE, FEMALE hoặc OTHER.");
    }
    return new Gender({ value: normalizedGender });
  }
}
