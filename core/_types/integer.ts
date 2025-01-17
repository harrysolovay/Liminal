import type { Type } from "../Type.ts"
import { declareType } from "./_declareType.ts"

export const integer: Type<number> = declareType(() => integer)
