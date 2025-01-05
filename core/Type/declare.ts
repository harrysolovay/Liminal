import { isTemplateStringsArray } from "../../util/mod.ts"
import type {
  DescriptionPart,
  DescriptionSubstitution,
  DescriptionValue,
  Type,
  TypeDeclaration,
} from "../Type.ts"
import { run } from "./run.ts"

export function declare<T, E>(
  declaration: TypeDeclaration,
  trace = new Error().stack!,
  descriptionParts: Array<DescriptionPart> = [],
  eventHandlers: Array<(event: unknown) => unknown> = [],
): Type<T, E> {
  return Object.assign(
    describe,
    declaration,
    {
      trace,
      descriptionParts,
      eventHandlers,
      run,
      *[Symbol.iterator]() {
        return yield {
          type: "Complete",
          value: this as never,
        }
      },
    } satisfies Omit<Type<T, E>, keyof TypeDeclaration | "T" | "E">,
  ) as never

  function describe(
    template: TemplateStringsArray,
    ...substitutions: Array<DescriptionSubstitution>
  ): Type<T, E>
  function describe(...values: Array<DescriptionValue>): Type<T, E>
  function describe(
    e0: TemplateStringsArray | DescriptionValue,
    ...rest: Array<DescriptionSubstitution | DescriptionValue>
  ): Type<T, E> {
    return declare(declaration, trace, [
      ...descriptionParts,
      ...isTemplateStringsArray(e0)
        ? [{
          template: e0,
          substitutions: rest as Array<DescriptionSubstitution>,
        }]
        : rest as Array<DescriptionValue>,
    ], eventHandlers)
  }
}
