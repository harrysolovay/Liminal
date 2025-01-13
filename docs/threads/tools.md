# Tools

```ts
import { system, T, tool } from "liminal"

function* WeatherDescription(city: string) {
  yield* tool(T.string, coordinates)`Get the coordinates of the specified city name.`

  yield* tool(T.Tuple(T.number, T.number), weather)`
    Get weather data based on the city's latitude and longitude.
  `

  yield `What is the temperature in ${city}?`

  return yield* T.string
}

declare function coordinates(city: string): Promise<[number, number]>

declare function weather([latitude, longitude]: [number, number]): Promise<string>
```
