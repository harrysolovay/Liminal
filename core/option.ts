import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export function option<X extends Type>(Some: X): Type<X["T"] | undefined, {}, X["P"]> {
  return declare({
    name: "option",
    source: {
      factory: option,
      args: { Some },
    },
    subschema: (visit) => ({
      discriminator: "type",
      anyOf: [{ type: "null" }, visit(Some)],
    }),
    output: (f) =>
      f<X["T"] | null>({
        visitor: (value, visit) => value === null ? undefined : visit(value, Some, "Some"),
      }),
  })
}
