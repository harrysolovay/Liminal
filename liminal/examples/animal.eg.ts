import { Annotation as A, Type as T } from "../mod.ts"

const U_: unique symbol = Symbol()
const U = T._(U_)

const Dog = T.object({
  bark: T.string,
  favoriteToy: T.string,
})

const Elephant = T.object({
  troopId: T.number,
  remembersYourFace: T.boolean,
})

const Option = T.union(
  T.object({
    value: Dog,
  }),
  T.null,
)
