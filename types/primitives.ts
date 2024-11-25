import { Ty } from "./Ty.ts"

export const none: Ty<null, never> = Ty(() => ({
  type: "null",
}))

export const boolean: Ty<boolean, never> = Ty(() => ({
  type: "boolean",
}))

export const number: Ty<number, never> = Ty(() => ({
  type: "number",
}))

export const string: Ty<string, never> = Ty(() => ({
  type: "string",
}))
