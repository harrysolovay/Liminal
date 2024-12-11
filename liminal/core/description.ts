import { recombine } from "../util/mod.ts"
import type { JSONTypeKind } from "./JSONSchema.ts"
import type { AnyType } from "./mod.ts"
import type { Type } from "./Type.ts"

export class DescriptionContext {
  constructor(
    readonly pins: Map<AnyType, string>,
    readonly args: Record<symbol, string>,
  ) {}

  pin = (type: AnyType): string => {
    let pin = this.pins.get(type)
    if (!pin) {
      pin = this.pins.size.toString()
      this.pins.set(type, pin)
    }
    return pin
  }
}

export function description(
  this: Type<JSONTypeKind, any, never>,
  ctx: DescriptionContext,
): string {
  const assertionDescriptions: Array<string> = []
  const segments: Array<string> = []
  this.annotations.forEach((annotation) => {
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
                    return ctx.args[part.key]
                  }
                  case "Type": {
                    return ctx.pin(part)
                  }
                }
              }),
            ))
            break
          }
          case "Type": {
            segments.push(ctx.pin(annotation))
            break
          }
          case "DescriptionParam": {
            const arg = ctx.args[annotation.key]!
            segments.push(arg)
            break
          }
          case "DescriptionArg": {
            ctx.args[annotation.key] = annotation.serializer?.(annotation.value)
              ?? annotation.value
            break
          }
          case "Assertion": {
            const { description, args } = annotation
            assertionDescriptions.push(
              typeof description === "string" ? description : description(...args),
            )
            break
          }
        }
      }
    }
  })
  return [
    ...segments,
    "\n\nEnsure:\n\n",
    ...assertionDescriptions.map((d) => `- ${d}`).join("\n"),
  ].join(" ")
}
