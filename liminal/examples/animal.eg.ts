import { L } from "../mod.ts"

const U_: unique symbol = Symbol()
const U = L._(U_)

const Dog = L.object({
  bark: L.string,
  favoriteToy: L.string,
})

const Elephant = L.object({
  troopId: L.number,
  remembersYourFace: L.boolean,
})

const Option = L.union(
  L.object({
    value: Dog,
  }),
  L.null,
)

const Container = L.object({
  Dog,
  Elephant,
  Option,
})

console.log(Container)
