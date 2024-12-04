import { T, Tool } from "structured-outputs"
import "@std/dotenv/load"

const _tool = Tool(
  "get_weather",
  T.Tuple(T.number`Latitude`, T.number`Longitude`),
)`Get the current weather for the specified latitude and longitude.`(
  async ([lat, lng]) => {
    const v = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`,
    )
    return await v.json()
  },
)
