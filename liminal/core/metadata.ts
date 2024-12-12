import type { AnyType } from "./Type.ts"

export function metadata(this: AnyType): Record<symbol, unknown> {
  return Object.fromEntries(
    this.annotations
      .filter((annotation) => typeof annotation === "object" && annotation?.type === "Metadata")
      .map(({ key, value }) => [key, value]),
  )
}
