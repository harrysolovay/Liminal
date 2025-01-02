import { L, model, run } from "liminal"
import OpenAI from "openai"

await run(function*() {
  // Set the root thread's model (inherited by subthreads).
  yield model.openai(new OpenAI(), "gpt-4o-mini")

  // Add the entered prompt reply into context.
  yield `User query: ${prompt("What can I assist you with?")!}`

  // Declare that we are about to describe the router.
  yield `We'll be routing the user query using the following router.`

  // Yield the router's signature (including descriptions).
  yield Root.signature(true)

  // Loop through clarification request until appropriate routing is clear to the LLM.
  while (true) {
    yield "Do we need any additional clarification in order to appropriately route the user query?"
    const request = yield* L.Option(L.string`The request for clarification.`)
    if (!request) {
      break
    }
    yield prompt(request)
  }

  // Delegate to the router thread, which inherits the current context and can therefore select
  // the appropriate route.
  yield* Root
})

const Root = L.Router({
  // Has prompts and tools tailored for tech troubleshooting and system admin tasks.
  IT: L.Router({ PasswordReset, TroubleShootSystemOutage, RequestSoftwareAccess })`
    Assist with resetting passwords, troubleshooting system outages, requesting software access.
  `,
  // Knows HR policies, can access employee data securely, and can provide relevant forms or direct employees to benefits portals.
  HR: L.Router({ CheckVacationDays, AskForLeavePolicies, UpdatePersonalInformation })`
    Assist with checking vacation days, asking for leave policies, updating personal information.
  `,
  // Integrates with purchase order systems, keeps track of budgets, and knows how to escalate approvals.
  Finance: L.Router({ OrderNewHardwareOrSoftware, CheckPurchaseApprovals })`
    Assist with ordering new hardware or software, checking purchase approvals.
  `,
})

function* PasswordReset() {}

function* TroubleShootSystemOutage() {}

function* RequestSoftwareAccess() {}

function* CheckVacationDays() {}

function* AskForLeavePolicies() {}

function* UpdatePersonalInformation() {}

function* OrderNewHardwareOrSoftware() {}

function* CheckPurchaseApprovals() {}
