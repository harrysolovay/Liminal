import { Value } from "./Value.ts"

export type NoneSource = any

export class none extends Value.make("none")<NoneSource, undefined, undefined> {}
