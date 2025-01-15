# Tools

```ts
import { L } from "liminal"

function* WeatherDescription(city: string) {
  yield* L.tool(L.string, coordinates)`
    Get the coordinates of the specified city name.
  `

  yield* L.tool(L.Tuple(L.number, L.number), weather)`
    Get weather data based on the city's latitude and longitude.
  `

  yield `What is the temperature in ${city}?`

  return yield* L.string
}

declare function coordinates(city: string): Promise<[number, number]>

declare function weather([latitude, longitude]: [number, number]): Promise<string>
```
