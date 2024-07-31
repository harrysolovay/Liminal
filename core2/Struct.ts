import { Type, Value, ValueSource } from "./Value.ts"

export interface Struct<F extends Fields = any>
  extends InstanceType<ReturnType<typeof Struct<F>>>
{}

export function Struct<F extends Fields>(fieldsTypes: FieldTypes<F>) {
  return class extends Value.make("Struct")<any, StructNative<F>, StructFrom<F>> {
    fieldsTypes = fieldsTypes
    fields = Object.fromEntries(
      Object
        .entries(fieldsTypes)
        .map(([k, v]) => [k, new v(new ValueSource.StructField(this, k))]),
    ) as F
  }
}

export type Fields = Record<string, Value>

export type FieldTypes<F extends Fields> = { [K in keyof F]: Type<F[K]> }

export type StructNative<F extends Fields> = { [K in keyof F]: Value.Native<F[K]> }

export type StructFrom<F extends Fields> = [
  { [K in keyof F]: F[K] | Value.From<F[K]> | Value.Native<F[K]> },
][0]
