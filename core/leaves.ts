import { Ty } from "./Ty.ts"

export type none = Ty<null>
export const none: Ty<null, never> = Ty((description) => ({
  type: "null",
  description,
}))

export type bool = Ty<boolean>
export const bool: Ty<boolean, never> = Ty((description) => ({
  type: "boolean",
  description,
}))

export type num = Ty<number>
export const num: Ty<number, never> = Ty((description) => ({
  type: "number",
  description,
}))

export type str = Ty<string>
export const str: Ty<string, never> = Ty((description) => ({
  type: "string",
  description,
}))
