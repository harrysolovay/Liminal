import type { Args } from "./Context.ts"
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
      ...type.declaration.subschema(RefSchema(nextArgs), type.ctx),
      ...ctxSegments.length ? { description: ctxSegments.join(" ") } : {},
    }
  }
}

// export type Format =
//   | DateFormat
//   | EmailFormat
//   | HostnameFormat
//   | IpAddressFormat
//   | ResourceIdentifiersFormat
//   | UriTemplateFormat
//   | JsonPointerFormat

// export type DateFormat = "date-time" | "time" | "date" | "duration"
// export type EmailFormat = "email" | "idn-email"
// export type HostnameFormat = "hostname" | "idn-hostname"
// export type IpAddressFormat = "ipv4" | "ipv6"
// export type ResourceIdentifiersFormat = "uuid" | "uri" | "uri-reference" | "iri" | "iri-reference"
// export type UriTemplateFormat = "uri-template"
// export type JsonPointerFormat = "json-pointer"
