import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation } from "./annotations/Annotation.ts"
import type { TemplatePart } from "./annotations/mod.ts"
import { inspect } from "./inspect.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"
import { type Type, type TypeDeclaration, TypeKey } from "./Type.ts"

export function declare<T, D extends symbol>(
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
      extract: () => {
        throw 0
      },
    } satisfies Omit<Type<T, D>, "T" | "D"> as never,
  )

  function Type<A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceDependencies<D, A>>
  function Type<A extends Array<Annotation>>(...annotations: A): Type<T, ReduceDependencies<D, A>>
  function Type(
    maybeTemplate: Annotation | TemplateStringsArray,
    ...parts: Array<Annotation>
  ): Type<T, symbol> {
    if (isTemplateStringsArray(maybeTemplate)) {
      return declare(declaration, [...annotations, {
        type: "Template",
        template: maybeTemplate,
        parts: parts as Array<TemplatePart>,
      }])
    }
    return declare(declaration, [maybeTemplate, ...annotations, ...parts])
  }
}
