import { L } from "liminal"

const EasterEggKey = Symbol()
const EasterEgg = L.Param(EasterEggKey, (value: { secret: string }) => value)

const A = L.string(EasterEgg)
const B = A(EasterEgg({
  secret: "I have telekinesis.",
}))
const C = B(EasterEgg({
  secret: "And know how to make good waffles.",
}))

const _metadata = C.extract(EasterEgg)

const MyDescriptionKey = Symbol()
const MyDescription = L.DescriptionParam(MyDescriptionKey)

const D = C`Some additional description: ${MyDescription}`
const E = D(MyDescription("The description."))

const _description = E.extract(MyDescription)
