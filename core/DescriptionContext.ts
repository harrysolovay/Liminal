import { recombine } from "../util/mod.ts"
import type { AnyType } from "./mod.ts"
import type { Type } from "./Type.ts"

export function description(type: Type<unknown>): string | undefined {
  return new DescriptionContext(new Map(), {}).format(type)
}

export class DescriptionContext {
  constructor(
    readonly pins: Map<AnyType, string> = new Map(),
    readonly args: Record<symbol, string> = {},
  ) {}

  pin = (type: AnyType): string => {
    let pin = this.pins.get(type)
    if (!pin) {
      pin = this.pins.size.toString()
      this.pins.set(type, pin)
    }
    return pin
  }

  format = (type: Type<unknown>): undefined | string => {
    const assertionDescriptions: Array<string> = []
    let segments: Array<string> = []
    type.annotations.forEach((annotation) => {
      if (annotation) {
        if (typeof annotation === "string") {
          segments.push(annotation)
        } else {
          switch (annotation.type) {
            case "DescriptionTemplate": {
              segments.push(recombine(
                annotation.template,
                annotation.parts.map((part) => {
                  if (typeof part === "string") {
                    return part
                  }
                  switch (part.type) {
                    case "DescriptionParam": {
                      return this.args[part.key]
                    }
                    case "Type": {
                      return this.pin(part)
                    }
                  }
                }),
              ))
              break
            }
            case "Type": {
              segments.push(this.pin(annotation))
              break
            }
            case "DescriptionParam": {
              const arg = this.args[annotation.key]!
              segments.push(arg)
              break
            }
            case "DescriptionArg": {
              this.args[annotation.key] = annotation.serializer?.(annotation.value)
                ?? annotation.value
              break
            }
            case "Assertion": {
              const { description, args } = annotation
              assertionDescriptions.push(
                typeof description === "string" ? description : description(...args ?? []),
              )
              break
            }
          }
        }
      }
    })
    segments = [
      ...segments,
      ...assertionDescriptions.length
        ? [
          "\n\nEnsure:\n\n",
          ...assertionDescriptions.map((d) => `- ${d}`).join("\n"),
        ]
        : [],
    ]
    return segments.length ? segments.join(" ") : undefined
  }
}
