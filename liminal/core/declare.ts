import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import { assert } from "./assert.ts"
import { description } from "./DescriptionContext.ts"
import { deserialize } from "./deserialize.ts"
import type { JSONTypeName } from "./JSONSchema.ts"
import { metadata } from "./metadata.ts"
import { signature } from "./signature.ts"
import { toJSON } from "./toJSON.ts"
import type { Type, TypeDeclaration } from "./Type.ts"

export function declare<T, P extends symbol>(
  jsonTypeName: JSONTypeName,
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, P> {
  return Object.assign(
    Type,
    {
      type: "Type",
      trace: new Error().stack!,
      declaration,
      annotations,
      signature,
      description,
      metadata,
      toJSON,
      assert,
      deserialize,
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
      return declare(jsonTypeName, declaration, [...annotations, {
        type: "DescriptionTemplate",
        template: maybeTemplate,
        parts: parts as Array<DescriptionTemplatePart>,
      }])
    }
    return declare(jsonTypeName, declaration, [maybeTemplate, ...annotations, ...parts])
  }
}
