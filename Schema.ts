import type { Args } from "./Context.ts"
import type { Type } from "./Type.ts"
import { recombine } from "./util/recombine.ts"

export type Schema = Record<string, unknown>

export type RefSchema = (type: Type) => Schema

export function RefSchema(ctxArgs: Args = {}, refine?: boolean): RefSchema {
  const nextArgs = { ...ctxArgs }
  return (type) => {
    const ctxSegments: Array<string> = []
    for (const part of type.ctx.parts) {
      if (part.template) {
        ctxSegments.unshift(
          recombine(part.template, part.params.map((paramKey) => nextArgs[paramKey])),
        )
      } else {
        Object.assign(nextArgs, part.args)
      }
    }
    if (refine === undefined || refine) {
      const refinementMessages = type.ctx.refinementMessages()
      if (refinementMessages) {
        for (const [key, value] of Object.entries(type.ctx.refinements)) {
          if (value !== undefined) {
            const message = refinementMessages[key]
            if (message) {
              ctxSegments.push(message)
            }
          }
        }
      }
    }
    return {
      ...type.decl.subschema(RefSchema(nextArgs, refine), type.ctx),
      ...ctxSegments.length ? { description: ctxSegments.join(" ") } : {},
    }
  }
}
