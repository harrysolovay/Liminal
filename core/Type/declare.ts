import { isTemplateStringsArray } from "../../util/mod.ts"
import type { Action } from "../Action.ts"
import type { ExtractEvent } from "../Event.ts"
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
      handle,
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

  function handle<Y extends Action>(
    f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
  ): Type<T, ExtractEvent<Y>>
  function handle<R>(f: (event: E) => R): Type<T, Exclude<Awaited<R>, void>>
  function handle(f: (event: E) => unknown): Type<T, unknown> {
    return declare(declaration, trace, descriptionParts, [...eventHandlers, f as never])
  }
}
