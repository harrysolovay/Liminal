export {}

// import type { Falsy } from "@std/assert"
// import {
//   type Adapter,
//   type AdapterDefaults,
//   DEFAULT_INSTRUCTIONS,
//   type JSONType,
// } from "../../mod.ts"

// export interface OllamaAdapterDescriptor {
//   model: string
//   role: "user"
//   completion: OllamaCompletion
//   I: OllamaUserMessage
//   O: OllamaAssistantMessage
// }

// export interface OllamaAdapterConfig {
//   endpoint?: string
//   defaultModel?: string
//   defaultInstructions?: string
// }

// export function OllamaAdapter({
//   endpoint = "127.0.0.1:1143",
//   defaultModel = "llama3.1",
//   defaultInstructions = DEFAULT_INSTRUCTIONS,
// }: OllamaAdapterConfig): Adapter<OllamaAdapterDescriptor> {
//   const defaults: AdapterDefaults<OllamaAdapterDescriptor> = {
//     model: defaultModel,
//     role: "user",
//     opening: {
//       role: "user",
//       content: defaultInstructions,
//     },
//   }
//   return {
//     defaults,
//     formatInput,
//   }

//   function formatInput(
//     texts: Array<string | Falsy>,
//     role?: OllamaAdapterDescriptor["role"],
//   ): Array<OllamaAdapterDescriptor["I"]> {
//     return texts.filter((v): v is string => !!v).map((content) => ({
//       role: role ?? defaults.role,
//       content,
//     }))
//   }
// }

// export interface OllamaCompletionRequest {
//   model: string
//   stream: false
//   messages: Array<OllamaUserMessage | OllamaAssistantMessage>
//   format: JSONType
//   options: {
//     temperature: number
//   }
// }

// export interface OllamaUserMessage {
//   role: "user"
//   content: string
// }

// export interface OllamaAssistantMessage {
//   role: "assistant"
//   content: string
// }

// export interface OllamaCompletion {
//   model: string
//   created_at: string
//   message: OllamaAssistantMessage
//   done_reason: "stop"
//   done: true
//   total_duration: number
//   load_duration: number
//   prompt_eval_count: number
//   prompt_eval_duration: number
//   eval_count: number
//   eval_duration: number
// }

// // http://localhost:11434/api/generate -H "Content-Type: application/json"
// const x = {
//   model: "llama3.1",
//   messages: [{
//     role: "user",
//     content:
//       "Ollama is 22 years old and busy saving the world. Return a JSON object with the age and availability.",
//   }],
//   stream: false,
//   format: {
//     type: "object",
//     properties: {
//       age: {
//         type: "integer",
//       },
//       available: {
//         type: "boolean",
//       },
//     },
//     required: [
//       "age",
//       "available",
//     ],
//   },
//   options: {
//     temperature: 0,
//   },
// }

// const response = {
//   model: "llama3.1",
//   created_at: "2024-12-06T00:46:58.265747Z",
//   message: { role: "assistant", content: "{\"age\": 22, \"available\": false}" },
//   done_reason: "stop",
//   done: true,
//   total_duration: 2254970291,
//   load_duration: 574751416,
//   prompt_eval_count: 34,
//   prompt_eval_duration: 1502000000,
//   eval_count: 12,
//   eval_duration: 175000000,
// }
