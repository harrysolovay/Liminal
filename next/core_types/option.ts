import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export function option<X extends Type>(Some: X): Type<X["T"] | undefined, {}, X["P"]> {
  return declare<X["T"] | null>()({
    name: "option",
    source: {
      factory: option,
      args: { Some },
    },
    subschema: (ref) => ({
      discriminator: "type",
      anyOf: [{ type: "null" }, ref(Some)],
    }),
    transform: (value, visit) => value === null ? undefined : visit(value, Some, "Some"),
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}
