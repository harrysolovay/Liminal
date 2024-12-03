import { Type } from "../../core/mod.ts"

export const string: Type<string> = Type<string>({
  getType: () => string,
})
