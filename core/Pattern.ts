import { Flatten } from "../util/Flatten.ts"
import { unimplemented } from "../util/unimplemented.ts"
import { Type, Value, ValueSource } from "./Value.ts"

export interface Resource<F extends PatternFieldTypes = any>
  extends InstanceType<ReturnType<typeof Resource<F>>>
{}

export function Resource<F extends PatternFieldTypes>(configTypes: F) {
  return class extends Value.make("Pattern")<PatternSource, PatternNative<F>, PatternFrom<F>> {
    static _deploy(from: PatternFrom<F>) {
      return this.new(from)
    }

    configTypes = configTypes
    config = Object.fromEntries(
      Object.entries(configTypes).map(([key, type]) => [
        key,
        new type(new ValueSource.Field(this, key)),
      ]),
    ) as PatternFields<F>

    destroy() {
      unimplemented()
    }
  }
}

export type PatternFieldTypes = Record<string, Type>

export type PatternFields<F extends PatternFieldTypes = any> = {
  [K in keyof F]: InstanceType<F[K]>
}

export type PatternFrom<F extends PatternFieldTypes = any> = {
  [K in keyof F]: F[K] extends Type<infer T> ? T | Value.From<T> | Value.Native<T> : never
}

export type PatternNative<F extends PatternFieldTypes> = Flatten<
  { [K in keyof F]: Value.Native<InstanceType<F[K]>> }
>

export type PatternSource = never
