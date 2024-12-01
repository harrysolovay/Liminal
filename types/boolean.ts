import { declareType, type Type } from "../core/mod.ts"

export const boolean: Type<boolean> = declareType({
  name: "boolean",
  source: {
    getType: () => boolean,
  },
})
