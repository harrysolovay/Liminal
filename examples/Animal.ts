import { L, type Rune } from "liminal"

export interface Animal {
  a: string
  b: string
}

export const Animal: Rune<Animal, never> = L.object({
  a: L.string,
  b: L.string,
})
