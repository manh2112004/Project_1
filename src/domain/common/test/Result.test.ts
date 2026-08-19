import { describe, it, expect } from "vitest";
import { ok, fail, ResultUtil } from "../Result";

describe("Result Pattern Core Primitive", () => {
  it("should create a Success result correctly", () => {
    const res = ok({ id: "123", name: "Laptop" });

    expect(res.isSuccess).toBe(true);
    expect(res.isFailure).toBe(false);
    if (res.isSuccess) {
      expect(res.value.name).toBe("Laptop");
    }
  });

  it("should create a Failure result correctly", () => {
    const res = fail({ code: "NOT_FOUND", message: "Item not found" });

    expect(res.isSuccess).toBe(false);
    expect(res.isFailure).toBe(true);
    if (res.isFailure) {
      expect(res.error.code).toBe("NOT_FOUND");
    }
  });

  it("should support ResultUtil.map for transform", () => {
    const res = ok(10);
    const mapped = ResultUtil.map(res, (x) => x * 2);

    expect(mapped.isSuccess).toBe(true);
    if (mapped.isSuccess) {
      expect(mapped.value).toBe(20);
    }
  });

  it("should support ResultUtil.flatMap for chaining", () => {
    const res = ok("valid_slug");
    const chained = ResultUtil.flatMap(res, (slug) => ok({ slug, active: true }));

    expect(chained.isSuccess).toBe(true);
    if (chained.isSuccess) {
      expect(chained.value.active).toBe(true);
    }
  });
});
