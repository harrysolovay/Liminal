import type { AnyType } from "./Type.ts"

export type { JsonValue as JSONValue } from "@std/json"

// TODO
export type JSONType = any

export function schema(type: AnyType): JSONType {}
