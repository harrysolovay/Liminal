import { L, type Type } from "../core/mod.ts"
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

export const MetaTypeMigration: MetaTypeMigration<never> = L.object({
  id: L.string,
  defId: L.string,
  path: PathLike,
  change: L.TaggedUnion({
    Create: MetaType,
    Update: MetaType,
    Delete: null,
  }),
  rationale: L.string,
})
