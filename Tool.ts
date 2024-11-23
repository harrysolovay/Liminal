import type { RootTy, Schema } from "./types/mod.ts"
import { recombineTaggedTemplateArgs } from "./util/recombineTaggedTemplateArgs.ts"

export function Tool<T>(name: string, ty: RootTy<T, never>): Tool<T> {
  return Tool_(name, ty)
}

function Tool_<T>(name: string, ty: RootTy<T, never>, description?: string): Tool<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...quasis: Array<string>) =>
      Tool_(
        name,
        ty,
        description ? `${description} ${recombineTaggedTemplateArgs(template, quasis)}` : undefined,
      ),
    {
      type: "function" as const,
      name,
      description,
      parameters: ty.schema(),
      toJson() {
        const { type, name, description, parameters } = this
        return { type, name, description, parameters }
      },
    },
  )
}

export interface Tool<T = any> {
  (template: TemplateStringsArray, ...quasis: Array<string>): Tool<T>
  type: "function"
  /** The name with which OpenAI recognizes the tool. */
  name: string
  /** A description to inform the LLM of when/how to use the tool. */
  description?: string
  /** The tool implementation's argument type in JSON Schema. */
  parameters?: Schema
}
