import { L, Tool } from "liminal"

export const weather = Tool(
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
