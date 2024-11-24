import type Openai from "openai"

export type JsonSchema = Openai.ResponseFormatJSONSchema["json_schema"]
export type ChatCompletion = Openai.Chat.ChatCompletion
export type ChatCompletionChoice = Openai.Chat.Completions.ChatCompletion.Choice
