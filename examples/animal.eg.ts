import { T } from "structured-outputs"

const Dog = T.object({
  bark: T.string,
  favoriteToy: T.string,
})

const Elephant = T.object({
  troopId: T.number,
  remembersYourFace: T.boolean,
})

const SlowLoris = T.object({
  poisonousElbows: T.boolean,
  cuteAsCouldBe: T.boolean,
})

export const Animal = T.taggedUnion("type", {
  Dog,
  Elephant,
  SlowLoris,
})
