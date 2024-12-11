import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import { assert } from "./assert.ts"
import { description } from "./description.ts"
import { deserializeValue } from "./deserializeValue.ts"
import type { JSONTypeKind } from "./JSONSchema.ts"
import { metadata } from "./metadata.ts"
import { signature } from "./signature.ts"
import { toJSON } from "./toJSON.ts"
import type { Type, TypeDeclaration } from "./Type.ts"

export function declare<K extends JSONTypeKind, T, P extends symbol>(
  kind: K,
  declaration: TypeDeclaration<T>,
  annotations: Array<Annotation> = [],
): Type<K, T, P> {
  return Object.assign(
    Type,
    {
      type: "Type",
      K,
      declaration,
      annotations,
      signature,
      description,
      metadata,
      toJSON,
      assert,
      deserializeValue,
    } satisfies Omit<Type<K, T, P>, "T" | "P"> as never,
  )

  function Type<A extends Array<DescriptionTemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<K, T, ReduceP<P, A>>
  function Type<A extends Array<Annotation>>(...annotations: A): Type<K, T, ReduceP<P, A>>
  function Type(
    maybeTemplate: Annotation | TemplateStringsArray,
    ...parts: Array<Annotation>
  ): Type<K, T, symbol> {
    if (isTemplateStringsArray(maybeTemplate)) {
      return declare(kind, declaration, [...annotations, {
        type: "DescriptionTemplate",
        template: maybeTemplate,
        parts: parts as Array<DescriptionTemplatePart>,
      }])
    }
    return declare(kind, declaration, [maybeTemplate, ...annotations, ...parts])
  }
}
