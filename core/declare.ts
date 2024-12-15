import { isTemplateStringsArray } from "../util/mod.ts"
import type { Annotation, DescriptionTemplatePart, ReduceP } from "./Annotation.ts"
import { AssertionContext } from "./AssertionContext.ts"
import { DescriptionContext } from "./DescriptionContext.ts"
import { deserialize } from "./deserialize.ts"
import type { JSONType } from "./JSONSchema.ts"
import { signature, signatureHash } from "./signature.ts"
import { toJSON } from "./toJSON.ts"
import { type Type, type TypeDeclaration, TypeKey } from "./Type.ts"

export function declare<T, P extends symbol>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, P> {
  const self = Object.assign(
    Type,
    {
      [TypeKey as never]: true,
      type: "Type",
      trace: new Error().stack!,
      declaration,
      annotations,
      description: (): undefined | string => new DescriptionContext(new Map(), {}).format(self),
      signature: (): string => signature(self),
      signatureHash: (): Promise<string> => signatureHash(self),
      metadata: () => {
        return Object.fromEntries(
          annotations
            .filter((annotation) =>
              typeof annotation === "object" && annotation?.type === "Metadata"
            )
            .map(({ key, value }) => [key, value]),
        )
      },
      toJSON: (): JSONType => toJSON(self),
      assert: async (value) => {
        const ctx = new AssertionContext("root", [], [])
        ctx.visit(self, value)
        const diagnostics = [
          ...ctx.structuralDiagnostics,
          ...await Promise.all(ctx.annotationDiagnostics ?? []).then((v) => v.filter((e) => !!e)),
        ]
        if (diagnostics.length) {
          throw new AggregateError(diagnostics.map(({ exception }) => exception))
        }
      },
      deserialize: (jsonText): T => deserialize(JSON.parse(jsonText), self) as never,
    } satisfies Omit<Type<T, P>, "T" | "P"> as never,
  )
  return self

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

// [Symbol.for("nodejs.util.inspect.custom")](
//   this: AnyType,
//   _0: unknown,
//   _1: unknown,
//   inspect_: (value: unknown) => string,
// ): string {
//   return inspect(inspect_)
// },
// [Symbol.for("Deno.customInspect")](
//   this: AnyType,
//   inspect_: (value: unknown, opts: unknown) => string,
//   opts: unknown,
// ): string {
//   return inspect((x) => inspect_(x, opts))
// },
// function inspect(inspect: (value: unknown) => string): string {
//   if (declaration.getAtom) {
//     return `T.${declaration.kind}`
//   }
//   return `T.${declaration.kind}(${declaration.args.map((arg) => inspect(arg)).join(", ")})`
// }
