import type { Type } from "../Type.ts"
import { number } from "../types.ts"

const integerTag: unique symbol = Symbol()

export const Integer: Type<number> = number.annotate({ [integerTag]: true })
