import { L, type Type } from "../mod.ts"
import { MetaType } from "./MetaType.ts"

export type MetaTypeMigration<P extends symbol> = Type<{
  id: string
  defId: string
  path: Array<number | string>
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
  path: L.array(L.union(L.integer, L.string)),
  change: L.TaggedUnion({
    Create: MetaType,
    Update: MetaType,
    Delete: null,
  }),
  rationale: L.string,
})
