export {}

// import { OpenAIAdapter } from "liminal/openai"
// import OpenAI from "openai"
// import "@std/dotenv/load"
// import { L, Liminal } from "liminal"
// import { dbg } from "testing"

// const liminal = new Liminal(OpenAIAdapter({
//   openai: new OpenAI(),
// }))

// liminal.tool(
//   L.object({
//     latitude: L.number,
//     longitude: L.number,
//   }),
//   {
//     description: "Get the current weather for the specified latitude and longitude.",
//     f: ({ latitude, longitude }) => fetchWeather(latitude, longitude),
//   },
// )

// await liminal.value(L.number, {
//   messages: [{
//     role: "user",
//     content: "What is the weather like in New York City?",
//   }],
// }).then(dbg)

// function fetchWeather(latitude: number, longitude: number): Promise<unknown> {
//   return fetch(
//     `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`,
//   ).then((v) => v.json())
// }
