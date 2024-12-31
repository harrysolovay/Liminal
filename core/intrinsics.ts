import { isTemplateStringsArray } from "../util/mod.ts"
import type { Action, ReduceAction } from "./actions.ts"
import type { Annotation, TemplatePart } from "./annotations/mod.ts"
import {
  assert,
  description,
  deserialize,
  display,
  extract,
  inspect,
  schema,
  signature,
} from "./methods/mod.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"
import { type AnyType, type Type, type TypeDeclaration, TypeKey } from "./Type.ts"

export { null_ as null }
const null_: Type<null> = declare({
  type: "null",
  self() {
    return null_
  },
})

export const boolean: Type<boolean> = declare({
  type: "boolean",
  self() {
    return boolean
  },
})

export const integer: Type<number> = declare({
  type: "integer",
  self() {
    return integer
  },
})

export const number: Type<number> = declare({
  type: "number",
  self() {
    return number
  },
})

export const string: Type<string> = declare({
  type: "string",
  self() {
    return string
  },
})

export { const_ as const }
function const_<T, E, D extends symbol, const A extends T>(
  type: Type<T, E, D>,
  value: A,
): Type<A, E, D> {
  return declare({
    type: "const",
    self() {
      return const_
    },
    args: [type, value],
  })
}
Object.defineProperty(const_, "name", { value: "const" })

export function array<T, E, D extends symbol>(element: Type<T, E, D>): Type<Array<T>, E, D> {
  return declare({
    type: "array",
    self() {
      return array
    },
    args: [element],
  })
}

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<
  { [K in keyof F]: F[K]["T"] },
  F[keyof F]["E"],
  F[keyof F]["D"]
> {
  return declare({
    type: "object",
    self() {
      return object
    },
    args: [Object.fromEntries(Object.keys(fields).toSorted().map((key) => [key, fields[key]]))],
  })
}

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare({
    type: "enum",
    self() {
      return enum_
    },
    args: values.toSorted(),
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })

export function union<M extends Array<AnyType>>(
  ...members: M
): Type<M[number]["T"], M[number]["E"], M[number]["D"]> {
  return declare({
    type: "union",
    self() {
      return union
    },
    args: members,
  })
}

export function deferred<T, E, D extends symbol>(get: () => Type<T, E, D>): Type<T, E, D> {
  return declare({
    type: "deferred",
    self() {
      return deferred
    },
    args: [get],
  }) as never
}

export function gen<F, E, Y extends Action, D extends symbol, T>(
  _name: string,
  _from: Type<F, E, D>,
  _run: (this: Thread, value: F) => Generator<Y, T> | AsyncGenerator<Y, T>,
): Type<T, ReduceAction<E, Y>, D> {
  throw 0
}

export function f<T, E, D extends symbol, R>(
  name: string,
  from: Type<T, E, D>,
  run: (this: Thread, value: T) => R,
): Type<Awaited<R>, E, D> {
  return declare({
    type: "transform",
    self() {
      return f
    },
    args: [name, from, run],
  })
}

// TODO: allow `D` to be specified at root?
export interface Thread {
  <T, E>(type: Type<T, E>): Type<T, E>
}

function declare<T, E, D extends symbol>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, E, D> {
  return Object.assign(
    Type,
    inspect,
    declaration,
    {
      ...{} as Generator<never, T>,
      [TypeKey]: true,
      node: "Type",
      trace: new Error().stack!,
      annotations,
      display,
      extract,
      description,
      signature,
      schema,
      deserialize,
      assert,
      is(value): value is T {
        try {
          assert.call(this as Type<T, E, D>, value)
          return true
        } catch (_e: unknown) {
          return false
        }
      },
      serialize() {
        throw 0
      },
      handle() {
        throw 0
      },
    } satisfies Omit<Type<T, E, D>, keyof TypeDeclaration | "T" | "E" | "D"> as never,
  )

  function Type<A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, E, ReduceDependencies<D, A>>
  function Type<A extends Array<Annotation>>(
    ...annotations: A
  ): Type<T, E, ReduceDependencies<D, A>>
  function Type(
    e0: Annotation | TemplateStringsArray,
    ...eRest: Array<Annotation>
  ): Type<T, E, symbol> {
    if (isTemplateStringsArray(e0)) {
      return declare(declaration, [...annotations, {
        node: "Template",
        template: e0,
        parts: eRest as Array<TemplatePart>,
      }])
    }
    return declare(declaration, [...annotations, e0, ...eRest])
  }
}
