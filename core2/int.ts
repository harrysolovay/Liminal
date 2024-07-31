import { unimplemented } from "../util/unimplemented.ts"
import { bool } from "./bool.ts"
import { Args, Type, Value } from "./Value.ts"

export type u = u8 | u16 | u32 | u64 | u128 | u256
export type i = i8 | i16 | i32 | i64 | i128 | i256

export class u8 extends Int(false, 8)<never, u16 | u32 | u64 | u128 | u256> {}
export class u16 extends Int(false, 16)<u8, u32 | u64 | u128 | u256> {}
export class u32 extends Int(false, 32)<u8 | u16, u64 | u128 | u256> {}
export class u64 extends Int(false, 64)<u8 | u16 | u32, u128 | u256> {}
export class u128 extends Int(false, 128)<u8 | u16 | u32 | u64, u256> {}
export class u256 extends Int(false, 256)<u8 | u16 | u32 | u64 | u128, never> {}

export class i8 extends Int(false, 8)<never, i16 | i32 | i64 | i128 | i256> {}
export class i16 extends Int(false, 16)<i8, i32 | i64 | i128 | i256> {}
export class i32 extends Int(false, 32)<i8 | i16, i64 | i128 | i256> {}
export class i64 extends Int(false, 64)<i8 | i16 | i32, i128 | i256> {}
export class i128 extends Int(false, 128)<i8 | i16 | i32 | i64, i256> {}
export class i256 extends Int(false, 256)<i8 | i16 | i32 | i64 | i128, never> {}

function Int<Signed extends boolean, Size extends IntSize>(signed: Signed, size: Size) {
  return class<ExtraFrom extends Value, Into extends Value, ExtraSource = never>
    extends Value.make(`${signed ? "i" : "u"}${size}`)<
      IntSource | ExtraSource,
      number,
      number | ExtraFrom,
      Into
    >
  {
    static min<T extends Value>(this: Type<T>): T {
      unimplemented()
    }

    static max<T extends Value>(this: Type<T>): T {
      unimplemented()
    }

    signed = signed
    size = size

    add<T extends Value>(this: T, ...[_amount]: Args<[amount: T]>): T {
      unimplemented()
    }

    subtract<T extends Value>(this: T, ...[_amount]: Args<[amount: T]>): T {
      unimplemented()
    }

    multiply<T extends Value>(this: T, ...[_amount]: Args<[amount: T]>): T {
      unimplemented()
    }

    divide<T extends Value>(this: T, ...[_amount]: Args<[amount: T]>): T {
      unimplemented()
    }

    square<T extends Value>(this: T): T {
      unimplemented()
    }

    logarithm<T extends Value>(this: T, ...[_amount]: Args<[amount: T]>): T {
      unimplemented()
    }

    gt<T extends Value>(this: T, ...[_operand]: Args<[operand: T]>): bool {
      unimplemented()
    }

    gte<T extends Value>(this: T, ...[_operand]: Args<[operand: T]>): bool {
      unimplemented()
    }

    lt<T extends Value>(this: T, ...[_operand]: Args<[operand: T]>): bool {
      unimplemented()
    }

    lte<T extends Value>(this: T, ...[_operand]: Args<[operand: T]>): bool {
      unimplemented()
    }
  }
}

export type IntSize = 8 | 16 | 32 | 64 | 128 | 256
export type IntSource = any
