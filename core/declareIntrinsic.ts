import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation } from "./annotations/Annotation.ts"
import type { Arg, Param, TemplatePart } from "./annotations/mod.ts"
import { DescriptionContext } from "./description.ts"
import { inspect } from "./inspect.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"
import { signatureHashMemo, signatureMemo } from "./signature.ts"
import { type PartialType, type Type, type TypeDeclaration, TypeKey } from "./Type.ts"

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
      description,
      signature,
      signatureHash,
      extract,
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

function signature(this: PartialType): string {
  return signatureMemo.getOrInit(this)
}

function signatureHash(this: PartialType): Promise<string> {
  return signatureHashMemo.getOrInit(this)
}

export function description(this: Type<unknown, never>): string | undefined {
  return new DescriptionContext(new Map(), {}).format(this)
}

function extract<K extends symbol, V>(this: PartialType, param: Param<K, V>): Array<V> {
  return this.annotations.filter((annotation): annotation is Arg<K> =>
    typeof annotation === "object" && annotation?.type === "Arg"
    && annotation.key === param.key
  ).map((arg) => arg.value)
}
