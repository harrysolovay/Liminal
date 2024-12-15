import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"
import { TaggedUnion } from "../utility/mod.ts"
import { MetaType } from "./MetaType.ts"
import { PathLike } from "./PathLike.ts"

export type MetaTypeMigration = {
  id: string
  defId: string
  path: PathLike
  change: {
    type: "Create"
    value: Type<unknown, never>
  } | {
    type: "Update"
    value: Type<unknown, never>
  } | {
    type: "Delete"
  }
  rationale: string
}

export const MetaTypeMigration: Type<MetaTypeMigration, never> = I.object({
  id: I.string,
  defId: I.string,
  path: PathLike,
  change: TaggedUnion("type", {
    Create: MetaType,
    Update: MetaType,
    Delete: null,
  }),
  rationale: I.string,
})
