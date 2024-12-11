import { L, Tool } from "../mod.ts"

const U_: unique symbol = Symbol()
const U = L._(U_)

const Dog = L.object({
  bark: L.string`Have stuff here.`,
  favoriteToy: L.string,
})

const Elephant = L.object({
  troopId: L.number,
  remembersYourFace: L.boolean,
  x: L.Tuple(L.number, L.string),
})

const Intersection = L.Intersection(
  L.object({
    value: Dog`Add a ref to ${Elephant}`,
  }),
  L.object({
    value: Elephant,
  }),
)

const Container = L.TaggedUnion({
  Dog,
  Elephant,
  Intersection,
})(U("something"))

console.log(JSON.stringify(Container, null, 2))
