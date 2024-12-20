import "@std/dotenv/load"
import { $assert, L, Liminal, OllamaAdapter, Tool } from "liminal"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

const weather = Tool(
  "Get the current weather for the specified latitude and longitude.",
  L.Tuple(
    L.number`latitude`,
    L.number`longitude`,
  ),
  ([latitude, longitude]) =>
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`,
    ).then((v) => v.json()),
)

const result = await $`What is the weather like in New York City?`(
  L.string,
  {
    tools: { weather },
  },
)

await $assert($, result, "is a description of the weather in New York City.")
