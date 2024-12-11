import type { Type } from "../Type.ts"

export { null_ as null }
declare const null_: Type<"null", null, never>

export declare const boolean: Type<"boolean", boolean, never>

export declare const integer: Type<"integer", number, never>

export declare const number: Type<"number", number, never>

export declare const string: Type<"string", string, never>
