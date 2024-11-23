import { Ty } from "./Ty.ts"

export const none = Ty<null>((description) => ({
  type: "null",
  description,
}))

export const boolean = Ty<boolean>((description) => ({
  type: "boolean",
  description,
}))

export const number = Ty<number>((description) => ({
  type: "number",
  description,
}))

export const string = Ty<string>((description) => ({
  type: "string",
  description,
}))
