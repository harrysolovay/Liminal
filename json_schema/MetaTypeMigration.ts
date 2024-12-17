import * as I from "../core/intrinsics/mod.ts"
import type { Type } from "../core/Type.ts"
import { TaggedUnion } from "../core/utility/mod.ts"
import { MetaType } from "./MetaType.ts"
import { PathLike } from "./PathLike.ts"

export type MetaTypeMigration<P extends symbol> = Type<{
  id: string
  defId: string
  path: PathLike
  change: {
    type: "Create"
    value: Type<unknown>
  } | {
    type: "Update"
    value: Type<unknown>
  } | {
    type: "Delete"
  }
  rationale: string
}, P>

export const MetaTypeMigration: MetaTypeMigration<never> = I.object({
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
