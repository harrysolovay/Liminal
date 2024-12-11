import { const as const_, enum as enum_, object, string, union } from "../intrinsics/mod.ts"
import { JSONType } from "../JSONSchema.ts"
import { Type } from "../Type.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export const MetaType: Type<"union", JSONType, never> = union(
  object({
    type: enum_("null", "boolean", "integer", "number"),
  }),
  object({
    type: const_(string, "string"),
  }),
)
