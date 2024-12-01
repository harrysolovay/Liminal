import type { Schema } from "../json_schema/Schema.ts"
import type { Type } from "./Type.ts"

export declare function fromSchema<T = any>(schema: Schema): Type<T>
