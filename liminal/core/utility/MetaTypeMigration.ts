import * as I from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"
import { MetaType } from "./MetaType.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export type MetaTypeMigration = {
  defId: string
  path: number | string | Array<number | string>
  suggestion: {
    type: "Create"
    value: JSONType
  } | {
    type: "Update"
    value: JSONType
  } | {
    type: "Remove"
  }
  rationale: string
}

export const MetaTypeMigration: Type<"object", MetaTypeMigration, never> = I.f(() =>
  I.object({
    defId: I.string,
    path: I.union(
      I.integer,
      I.string,
      I.array(I.union(I.integer, I.string)),
    ),
    suggestion: TaggedUnion({
      Create: MetaType,
      Update: MetaType,
      Remove: null,
    }),
    rationale: I.string,
  })
)
