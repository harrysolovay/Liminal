import { Type } from "../Type.ts"

export const string: Type<string> = Type<string>({
  name: "string",
  source: {
    getType: () => string,
  },
})
