import { exec, L, model } from "liminal"
import OpenAI from "openai"
import { dbg } from "testing"

// Has prompts and tools tailored for tech troubleshooting and system admin tasks.
const IT = L.thread(function*() {})`
  Assist with resetting passwords, troubleshooting system outages, requesting software access.
`

// Knows HR policies, can access employee data securely, and can provide relevant forms or direct employees to benefits portals.
const HR = L.thread(function*() {})`
  Assist with checking vacation days, asking for leave policies, updating personal information.
`

// Integrates with purchase order systems, keeps track of budgets, and knows how to escalate approvals.
const Finance = L.thread(function*() {})`
  Assist with ordering new hardware or software, monitoring purchase approvals.
`

await exec(function*() {
  yield model.openai(new OpenAI(), "gpt-4o-mini")

  yield prompt("What can I assist you with?")!

  yield* L.Router({ IT, HR, Finance })
}).then(dbg)
