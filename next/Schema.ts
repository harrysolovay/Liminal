import type { Args } from "./SemanticContext.ts"
import type { Type } from "./Type.ts"
import { recombine } from "./util/recombine.ts"

export type Schema = Record<string, unknown>

export type Subschema = (ref: RefSchema) => Schema

export type RefSchema = (type: Type) => Schema

export function RefSchema(ctxArgs: Args = {}): RefSchema {
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
    return {
      ...type.declaration.subschema(RefSchema(nextArgs)),
      ...ctxSegments.length ? { description: ctxSegments.join(" ") } : {},
    }
  }
}
