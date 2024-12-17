import { declare } from "./declareIntrinsic.ts"
import type { AnyType, Type } from "./Type.ts"

export { null_ as null }
const null_: Type<null> = declare({
  getAtom: () => null_,
})

export const boolean: Type<boolean> = declare({
  getAtom: () => boolean,
})

export const integer: Type<number> = declare({
  getAtom: () => integer,
})

export const number: Type<number> = declare({
  getAtom: () => number,
})

export const string: Type<string> = declare({
  getAtom: () => string,
})

export { const_ as const }
function const_<T, P extends symbol, const A extends T>(
  type: Type<T, P>,
  value: A,
): Type<A, P> {
  return declare({
    factory: const_,
    args: [type, value],
  })
}
Object.defineProperty(const_, "name", { value: "const" })

export function array<T, P extends symbol>(element: Type<T, P>): Type<Array<T>, P> {
  return declare({
    factory: array,
    args: [element],
  })
}

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return declare({
    factory: object,
    args: [Object.fromEntries(Object.keys(fields).toSorted().map((key) => [key, fields[key]]))],
  })
}

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare({
    factory: enum_,
    args: values.toSorted(),
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["P"]> {
  return declare({
    factory: union,
    args: members,
  })
}

export function ref<T, P extends symbol>(get: () => Type<T, P>): Type<T, P> {
  return declare({
    factory: ref,
    args: [get],
  }) as never
}

export function transform<T, P extends symbol, R>(
  from: Type<T, P>,
  f: (value: T) => R,
): Type<R, P> {
  return declare({
    factory: transform,
    args: [from, f],
  })
}
