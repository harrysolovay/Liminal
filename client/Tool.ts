import type { Schema, Type } from "../core/mod.ts"
import { recombine } from "../util/mod.ts"

export interface Tool<T> extends FinalTool<T> {
  (template: TemplateStringsArray, ...values: Array<unknown>): FinalTool<T>
}

export function Tool<T>(name: string, type: Type<T, any, never>): Tool<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: unknown[]) =>
      FinalTool(name, type, recombine(template, values)),
    FinalTool(name, type),
  )
}

interface FinalTool<T> {
  type: "function"
  /** The name with which OpenAI recognizes the tool. */
  name: string
  /** A description to inform the LLM of when/how to use the tool. */
  description?: string
  /** The tool implementation's argument type in JSON Schema. */
  parameters: Schema
  /** A phantom to represent the native parameter type. */
  T: T
}

function FinalTool<T>(
  name: string,
  type: Type<T, any, never>,
  description?: string,
): FinalTool<T> {
  return {
    type: "function",
    name,
    description,
    parameters: type.schema(),
    ...{} as { T: T },
  }
}
