import { declare, type Type } from "../core/mod.ts"

export const boolean: Type.Initial<boolean> = declare({
  name: "boolean",
  source: {
    getType: () => boolean,
  },
  subschema: () => ({ type: "boolean" }),
})
