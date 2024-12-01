import { T } from "structured-outputs"

const type = T.string`Something ${"here"}`
export const g: typeof type = type
