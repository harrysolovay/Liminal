// @egts:skip

import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"
import OpenAI from "openai"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Character = L.MetaType`A character of a superhero story.`

const Hero = await $(Character`The superhero.`)
const Villain = $(Character`The supervillain.`)
const Civilian = $(Character`Civilians.`)
const Sidekick = $(Character`The sidekick.`)

const Archetypes = L.Tuple(...await Promise.all([Hero, Villain, Civilian, Sidekick]))

await $(Archetypes).then(dbg)
