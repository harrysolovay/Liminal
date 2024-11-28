import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export const boolean: Type.Initial<boolean> = declare<boolean>()({
  name: "boolean",
  source: {
    getType: () => boolean,
  },
  subschema: () => ({ type: "boolean" }),
  transform: (value) => value,
  assertRefinementsValid: () => {},
  assertRefinements: {},
})
