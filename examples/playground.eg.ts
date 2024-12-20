// @egts:skip

import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { dbg } from "testing"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

const Character = L.MetaType`A character of a superhero story.`

const Hero = await $(Character`The superhero.`)
const Villain = $(Character`The supervillain.`)
const Civilian = $(Character`Civilians.`)
const Sidekick = $(Character`The sidekick.`)

const Archetypes = L.Tuple(...await Promise.all([Hero, Villain, Civilian, Sidekick]))

await $(Archetypes).then(dbg)
