import { Ty } from "./Ty.ts"

export type none<P extends string = string> = Ty<null, P>
export const none: Ty<null, never> = Ty((description) => ({
  type: "null",
  description,
}))

export type bool<P extends string = string> = Ty<boolean, P>
export const bool: Ty<boolean, never> = Ty((description) => ({
  type: "boolean",
  description,
}))

export type num<P extends string = string> = Ty<number, P>
export const num: Ty<number, never> = Ty((description) => ({
  type: "number",
  description,
}))

export type str<P extends string = string> = Ty<string, P>
export const str: Ty<string, never> = Ty((description) => ({
  type: "string",
  description,
}))
