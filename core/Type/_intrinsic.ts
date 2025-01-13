import { declare } from "./_declare.ts"
import type { Type } from "./Type.ts"

const null_: Type<null> = declare(() => null_)
export { null_ as null }

export const boolean: Type<boolean> = declare(() => boolean)

export const integer: Type<number> = declare(() => integer)

export const number: Type<number> = declare(() => number)

export const string: Type<string> = declare(() => string)

export function array<T>(element: Type<T>): Type<Array<T>> {
  return declare(() => array, [element])
}

export function object<F extends Record<string, Type>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }> {
  return declare(() => object, [fields])
}

function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare(() => enum_, values)
}
Object.defineProperty(enum_, "name", { value: "enum" })
export { enum_ as enum }

export function union<M extends Array<Type>>(...members: M): Type<M[number]["T"]> {
  return declare(() => union, members)
}

function const_<T, const V extends T>(type: Type<T>, value: V): Type<V> {
  return declare(() => const_, [type, value])
}
Object.defineProperty(const_, "name", { value: "const" })
export { const_ as const }

export function codec<F, T>(
  from: Type<F>,
  decode: (value: F) => T,
  encode: (value: T) => F,
): Type<T> {
  return declare(() => codec, [from, decode, encode])
}

export function deferred<T>(get: () => Type<T>): Type<T> {
  return declare(() => deferred, [get])
}
