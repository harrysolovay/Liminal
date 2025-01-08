import { L } from "liminal"
import { model } from "liminal/ollama"
import { Ollama } from "ollama"
import "@std/dotenv/load"

L
  .object({
    name: L.string,
    ownerName: L.string,
    favoriteToy: L.string,
    something: L.const(L.string, "HI!"),
  })
  .use(model(new Ollama(), "qwen2"))
  .run()
  .then(console.log)
