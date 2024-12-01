import { declareType, type Type } from "../core/mod.ts"

export const string: Type<string> = declareType<string>({
  name: "string",
  source: {
    getType: () => string,
  },
})
