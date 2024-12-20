import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation, TemplatePart } from "./annotations/mod.ts"
import {
  assert,
  description,
  deserialize,
  display,
  extract,
  inspect,
  signature,
  signatureHash,
  toJSON,
} from "./methods/mod.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"
import { type PartialType, type Type, type TypeDeclaration, TypeKey } from "./Type.ts"

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

export function object<F extends Record<string, PartialType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["D"]> {
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

export function union<M extends Array<PartialType>>(
  ...members: M
): Type<M[number]["T"], M[number]["D"]> {
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

function declare<T, D extends symbol>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, D> {
  return Object.assign(
    Type,
    inspect,
    {
      [TypeKey]: true,
      type: "Type",
      trace: new Error().stack!,
      declaration,
      annotations,
      display,
      extract,
      description,
      signature,
      signatureHash,
      toJSON,
      deserialize,
      assert,
    } satisfies Omit<Type<T, D>, "T" | "D"> as never,
  )

  function Type<A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceDependencies<D, A>>
  function Type<A extends Array<Annotation>>(...annotations: A): Type<T, ReduceDependencies<D, A>>
  function Type(
    e0: Annotation | TemplateStringsArray,
    ...eRest: Array<Annotation>
  ): Type<T, symbol> {
    if (isTemplateStringsArray(e0)) {
      return declare(declaration, [...annotations, {
        type: "Template",
        template: e0,
        parts: eRest as Array<TemplatePart>,
      }])
    }
    return declare(declaration, [e0, ...annotations, ...eRest])
  }
}
