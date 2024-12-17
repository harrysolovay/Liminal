import { L } from "liminal"

const EasterEgg = Symbol()

const easterEggs = L.MetadataParam(EasterEgg)<{ secret: string }>()

const MyString = L.string(easterEggs)(easterEggs({
  secret: "I have telekinesis.",
}))(easterEggs({
  secret: "And know how to make good waffles.",
}))

console.log(easterEggs.from(MyString))
