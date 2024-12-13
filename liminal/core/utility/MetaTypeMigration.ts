import * as I from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"
import { MetaType } from "./MetaType.ts"
import { PathLike } from "./PathLike.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export type MetaTypeMigration = {
  id: string
  defId: string
  path: PathLike
  change: {
    type: "Create"
    value: JSONType
  } | {
    type: "Update"
    value: JSONType
  } | {
    type: "Delete"
  }
  rationale: string
}

export const MetaTypeMigration: Type<MetaTypeMigration, never> = I.object({
  id: I.string,
  defId: I.string,
  path: PathLike,
  change: TaggedUnion({
    Create: MetaType,
    Update: MetaType,
    Delete: null,
  }),
  rationale: I.string,
})
