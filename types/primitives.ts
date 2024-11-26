import { Ty } from "./Ty.ts"

export const boolean: Ty<boolean, never, false> = Ty(() => ({ type: "boolean" }), false)

export const number: Ty<number, never, false> = Ty(() => ({ type: "number" }), false)

export const string: Ty<string, never, false> = Ty(() => ({ type: "string" }), false)
