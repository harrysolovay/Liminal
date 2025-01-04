import { L } from "liminal"

const PasswordReset = L.thread(function*() {})`
  Assist with resetting passwords.
`

const TroubleShootSystemOutage = L.thread(function*() {})`
  Assist with troubleshooting system outages.
`

const CheckVacationDays = L.thread(function*() {})`
  Assist with checking vacation days.
`

const AskForLeavePolicies = L.thread(function*() {})`
  Answer questions about leave policies.
`

const UpdatePersonalInformation = L.thread(function*() {})`
  Update personal information.
`

const OrderNewHardwareOrSoftware = L.thread(function*() {})`
  Assist with ordering new hardware or software.
`

const CheckPurchaseApprovals = L.thread(function*() {})`
  Check a purchase approval.
`

export const Root = L.Router({
  // Has prompts and tools tailored for tech troubleshooting and system admin tasks.
  IT: L.Router({ PasswordReset, TroubleShootSystemOutage })`
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
