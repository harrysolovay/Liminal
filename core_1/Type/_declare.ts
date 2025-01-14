import { Rune } from "../Rune.ts"
import type { Type } from "./Type.ts"

export function declare<T>(
  self: () => Type | ((...args: any) => Type),
  args?: Array<unknown>,
): Type<T> {
  return Rune(
    {
      kind: "Type",
      self,
      args,
      exec(_state) {
        return null!
      },
    },
    {
      description() {
        const segments: Array<string> = []
        for (const segment of this.annotations) {
          if (segment) {
            if (typeof segment === "string") {
              segments.push(segment)
            } else if ("template" in segment) {
              segments.push(String.raw(segment.template, segment.substitutions))
            }
          }
        }
        return segments.length ? segments.join(" ") : undefined
      },
    },
    [],
  )
}
