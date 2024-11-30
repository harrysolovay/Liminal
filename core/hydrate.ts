import type { Schema } from "./Schema.ts"
import type { Type } from "./Type.ts"

export declare function fromSchema<T = any>(schema: Schema): Type<T, {}, never>
