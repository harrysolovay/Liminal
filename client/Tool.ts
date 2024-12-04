import type { FunctionDefinition } from "openai/resources/shared"
import { toSchema, type Type } from "../core/mod.ts"
import { recombine } from "../util/mod.ts"

interface Tool<T> {
  /** The type from which the parameter schema is derived. */
  ""?: Type<T>
  /** The function responsible for processing the tool parameters and returning data back to the model. */
  f: (args: T) => unknown
  /** Tag required by the service. */
  type: "function"
  /** The underlying function definition. */
  function: FunctionDefinition
}

export interface ToolBuilder<T> {
  (
    template: TemplateStringsArray,
    ...values: Array<unknown>
  ): (f: (arg: T) => unknown) => Tool<T>
  (f: (arg: T) => unknown): Tool<T>
}

export function Tool<T>(name: string, parameter?: Type<T>): ToolBuilder<T> {
  return Object.assign(
    (
      templateOrF: TemplateStringsArray | ((arg: T) => unknown),
      ...maybeValues: unknown[]
    ) => {
      return typeof templateOrF === "function"
        ? make(templateOrF, parameter)
        : (f: (arg: T) => unknown) => make(f, parameter, recombine(templateOrF, maybeValues))
    },
  )

  function make<T>(f: (args: T) => unknown, parameter?: Type<T>, description?: string): Tool<T> {
    return {
      "": parameter,
      f,
      type: "function",
      function: {
        name,
        description,
        parameters: parameter ? toSchema(parameter) : undefined,
        strict: true,
      },
    }
  }
}
