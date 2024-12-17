import { isTemplateStringsArray } from "../../util/mod.ts"
import type { Annotation, ReduceP } from "../Annotation.ts"
import type { DescriptionTemplatePart } from "../annotations/mod.ts"
import { inspect } from "../inspect.ts"
import { type Type, type TypeDeclaration, TypeKey } from "../Type.ts"

export function declare<T, P extends symbol>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, P> {
  return Object.assign(
    Type,
    inspect,
    {
      [TypeKey as never]: true,
      type: "Type",
      trace: new Error().stack!,
      declaration,
      annotations,
    } satisfies Omit<Type<T, P>, "T" | "P"> as never,
  )

  function Type<A extends Array<DescriptionTemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, ReduceP<P, A>>
  function Type<A extends Array<Annotation>>(...annotations: A): Type<T, ReduceP<P, A>>
  function Type(
    maybeTemplate: Annotation | TemplateStringsArray,
    ...parts: Array<Annotation>
  ): Type<T, symbol> {
    if (isTemplateStringsArray(maybeTemplate)) {
      return declare(declaration, [...annotations, {
        type: "DescriptionTemplate",
        template: maybeTemplate,
        parts: parts as Array<DescriptionTemplatePart>,
      }])
    }
    return declare(declaration, [maybeTemplate, ...annotations, ...parts])
  }
}
