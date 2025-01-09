import { L, type Rune, Schema } from "liminal"

interface Animal {
  a: string
  b: string
  c: Animal
  d: {
    e: string
  }
}

const Animal: Rune<Animal, never> = L.object({
  a: L.string,
  b: L.string,
  c: L.deferred(() => Animal),
  d: L.object({
    e: L.string,
  }),
})

const schema = Schema(Animal)

console.log(schema.json)
