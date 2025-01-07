import { recombine } from "../util/mod.ts"
import type { Type } from "./Type.ts"

export function description(this: Type): string {
  const segments: Array<string> = []
  for (const segment of this.annotations) {
    if (segment) {
      if (typeof segment === "string") {
        segments.push(segment)
      } else if ("template" in segment) {
        segments.push(recombine(segment.template, segment.substitutions))
      }
    }
  }
  return segments.join(" ")
}
