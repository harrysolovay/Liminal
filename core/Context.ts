import { assert } from "@std/assert"
import { recombine } from "../util/mod.ts"

export class Context {
  constructor(
    readonly descriptionParts: DescriptionParts[],
    readonly assertionConfigs: Array<AssertionConfig>,
    readonly metadata: Record<symbol, unknown>,
  ) {}

  formatDescription(args: DescriptionArgs): string | undefined {
    const segments: Array<string> = []
    for (const part of this.descriptionParts) {
      if (typeof part === "string") {
        segments.push(part)
      } else if (part.template) {
        segments.unshift(
          recombine(
            part.template,
            part.params.map((paramKey) => {
              const part = args[paramKey]
              assert(
                typeof part === "string",
                `Cannot serialize description with unfilled part "${
                  typeof paramKey === "symbol" ? paramKey.description : paramKey
                }".`,
              )
              return part
            }),
          ),
        )
      } else {
        Object.assign(args, part.args)
      }
    }
    return segments.length ? segments.join(" ") : undefined
  }
}

export type DescriptionParts = string | {
  template: TemplateStringsArray
  params: DescriptionParams
  args?: never
} | {
  template?: never
  params?: never
  args: DescriptionArgs
}

export type DescriptionParams = Array<keyof any>

export type DescriptionArgs<P extends keyof any = keyof any> = Record<
  P,
  number | string | undefined
>

export type AssertionConfig = {
  assertion: Assertion
  args: Array<unknown>
  trace: string
}

export type Assertion<
  T = unknown,
  A extends unknown[] = unknown[],
> = (
  target: T,
  ...args: A
) => void | Promise<void>
