import { T } from "../mod.ts"

export const integerTag = Symbol()

export const Integer: typeof T.number = T.number.annotate(integerTag, true)
