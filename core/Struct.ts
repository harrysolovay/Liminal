import { Flatten } from "../util/Flatten.ts"
import { isKey } from "../util/isKey.ts"
import { unimplemented } from "../util/unimplemented.ts"
import { Key } from "./Key.ts"
import { Type, Value, ValueSource } from "./Value.ts"

export interface Struct<F extends FieldTypes = any>
  extends InstanceType<ReturnType<typeof Struct<F>>>
{}

export function Struct<const F extends FieldTypes>(fieldTypes: F) {
  return class extends Value.make("Struct")<StructSource, StructNative<F>, StructFrom<F>> {
    fieldTypes = fieldTypes
    fields = Object.fromEntries(
      Object.entries(fieldTypes).map(([key, type]) => [
        key,
        new (isKey(type) ? Key(type) : type)(
          new ValueSource.Field(this, key),
        ),
      ]),
    ) as Fields<F>

    // TODO: clean up typing
    set<
      T,
      V extends ValueFields<F>,
      K extends keyof V,
    >(
      this: T,
      _key: K,
      _setter: Value.Setter<InstanceType<V[K]>>,
    ): T {
      unimplemented()
    }
  }
}

export type FieldType = keyof any | Type
export type FieldTypes = Record<string, FieldType>

export type ValueFields<F extends FieldTypes> = Extract<
  Record<any, Type>,
  { [K in keyof F as F[K] extends Type ? K : never]: F[K] }
>

export type Fields<F extends FieldTypes = any> = {
  -readonly [K in keyof F]: F[K] extends keyof any ? Key<F[K]>
    : F[K] extends Type ? InstanceType<F[K]>
    : never
}

export type StructFrom<F extends FieldTypes = any> = F extends Record<string, keyof any> ? undefined
  : {
    -readonly [K in keyof F as F[K] extends Type ? K : never]: F[K] extends Type<infer T>
      ? T | Value.From<T> | Value.Native<T>
      : never
  }

type StructNativeField<T> = T extends Type<infer U> ? Value.Native<U> : T
export type StructNative<F extends FieldTypes> = Flatten<
  { -readonly [K in keyof F]: StructNativeField<F[K]> }
>

export type StructField<T> = T extends keyof any ? Key<T>
  : T extends Type ? InstanceType<T>
  : never

export type StructSource = never
