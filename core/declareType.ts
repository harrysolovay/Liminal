import type { JsonValue } from "@std/json"
import { isTemplateStringsArray } from "../util/mod.ts"
import type { DescriptionPart, Template, TemplatePart, Type, TypeDeclaration } from "./Type.ts"

export function declareType<T, E>(
  declaration: TypeDeclaration,
  traces: Array<string> = [new Error().stack!],
  descriptionParts: Array<DescriptionPart | Template> = [],
  handlers: Array<(event: unknown) => unknown> = [],
): Type<T, E> {
  return Object.assign(
    describe,
    declaration,
    {
      "": {
        traces,
        descriptionParts,
        handlers,
      },
      handle() {
        throw 0
      },
      run() {
        throw 0
      },
      description() {
        throw 0
      },
      signature() {
        throw 0
      },
      *[Symbol.iterator]() {
        return yield {
          type: "Complete",
          value: this as never,
        }
      },
    } satisfies Omit<Type<T, E>, keyof TypeDeclaration | "T" | "E">,
  ) as never as Type<T, E>

  function describe(...descriptionParts: Array<DescriptionPart>): Type<T, E>
  function describe(
    template: TemplateStringsArray,
    ...descriptionParts: Array<TemplatePart>
  ): Type<T, E>
  function describe(
    e0?: DescriptionPart | TemplateStringsArray,
    ...eRest: Array<DescriptionPart | TemplatePart>
  ): Type<T, E> {
    return declareType(
      declaration,
      [...traces, new Error().stack!],
      [
        ...descriptionParts,
        ...isTemplateStringsArray(e0)
          ? [{
            type: "Template" as const,
            template: e0,
            substitutions: eRest as Array<TemplatePart>,
          }]
          : eRest as Array<JsonValue>,
      ],
      handlers,
    )
  }
}
