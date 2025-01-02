import { AnnotationContext } from "../annotations/mod.ts"
import type { Type } from "../Type.ts"

export function description(this: Type<unknown, never>): string | undefined {
  return new AnnotationContext(this).format(true)
}
