import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import { assert } from "./AssertionContext.ts"
import { DescriptionContext } from "./DescriptionContext.ts"
import { deserialize } from "./deserialize.ts"
import { inspect } from "./inspect.ts"
import { signature, signatureHash } from "./signature.ts"
import { toJSON } from "./toJSON.ts"
import { type Type, type TypeDeclaration, TypeKey } from "./Type.ts"

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
      description,
      signature,
      signatureHash,
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
      return declare(declaration, [...annotations, {
        type: "DescriptionTemplate",
        template: maybeTemplate,
        parts: parts as Array<DescriptionTemplatePart>,
      }])
    }
    return declare(declaration, [maybeTemplate, ...annotations, ...parts])
  }
}

function description(this: Type<any, never>): string | undefined {
  return new DescriptionContext(new Map(), {}).format(this)
}

function metadata(this: Type<any, never>): Record<symbol, unknown> {
  return Object.fromEntries(
    this.annotations
      .filter((annotation) => typeof annotation === "object" && annotation?.type === "Metadata")
      .map(({ key, value }) => [key, value]),
  )
}
