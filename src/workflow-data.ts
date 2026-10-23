export type Brand = { src: string; name: string; className?: string }
export type Task = {
  label: string
  working: string[]
  detail: string
  done: string
  brand?: Brand
  icon?: "money" | "people" | "plane" | "file"
}
export type Workflow = {
  key: string
  source: string
  message: string
  sourceBrand: Brand
  tasks: Task[]
  result: string
  avatar?: string
  review?: { afterTask: number; request: string; approved: string; person: string }
}

const brand = {
  gmail: { src: "/assets/gmail-logo.png", name: "Gmail", className: "flow-brand-icon" },
  whatsapp: { src: "/assets/workflow-whatsapp.svg", name: "WhatsApp", className: "flow-brand-icon" },
  avinode: { src: "/assets/avinode-logotype.png", name: "Avinode" },
  fl3xx: { src: "/assets/fl3xx-logotype.png", name: "FL3XX" },
  camp: { src: "/assets/camp50-bluelogo.png", name: "CAMP" },
  veryon: { src: "/assets/veryon-primary-black.png", name: "Veryon" },
  veryonMark: { src: "/assets/workflow-veryon-mark.png", name: "Veryon", className: "flow-brand-icon" },
  avel: { src: "/assets/avel-mark.png", name: "Avel", className: "flow-brand-icon" },
} satisfies Record<string, Brand>

export const workflows: Workflow[] = [
  {
    key: "sales",
    source: "Marina · Charter inquiry",
    message: "Six guests, Teterboro to Naples on Thursday. Can you find a G650 or similar, with a 9am departure?",
    sourceBrand: brand.whatsapp,
    avatar: "/assets/personality-avatars/21-graceful.png",
    tasks: [
      { label: "Read email, WhatsApp, and phone requests", working: ["Reading request…", "Connecting messages…"], detail: "Marina · 6 guests · TEB → APF · Thu 09:00", done: "Connected", brand: brand.whatsapp },
      { label: "Identify the lead and match aircraft", working: ["Checking availability…", "Comparing aircraft…"], detail: "G650 or similar · seating, baggage, and departure fit", done: "Matched", brand: brand.avinode },
      { label: "Draft RFQ and client proposal", working: ["Building RFQ…", "Checking quote details…"], detail: "Route, passenger count, schedule, and operator terms included", done: "Drafted", icon: "money" },
    ],
    result: "RFQ drafted. Your broker has the next step.",
  },
  {
    key: "maintenance",
    source: "Pilot report · N724AV",
    message: "A cabin trim vibration was noted after arrival. Please coordinate inspection and keep the records with the aircraft.",
    sourceBrand: brand.veryonMark,
    avatar: "/assets/personality-avatars/05-serious.png",
    tasks: [
      { label: "Match the discrepancy to aircraft history", working: ["Reading pilot report…", "Checking prior records…"], detail: "N724AV · cabin trim report linked to aircraft history", done: "Linked", brand: brand.camp },
      { label: "Coordinate the maintenance request", working: ["Routing inspection…", "Collecting confirmation…"], detail: "Maintenance team assigned · inspection window confirmed", done: "Confirmed", brand: brand.veryon },
      { label: "File work order, sign-off, and invoice", working: ["Collecting documents…", "Matching work order…"], detail: "Technician sign-off received · documents filed together", done: "Filed", icon: "file" },
    ],
    result: "One aircraft record. Less chasing the paper trail.",
  },
  {
    key: "crew",
    source: "Dispatch · TEB to Naples",
    message: "Marina’s departure moved to 10:30am. Update the pilots and confirm fuel, catering, and handling with the FBO.",
    sourceBrand: brand.whatsapp,
    avatar: "/assets/personality-avatars/18-focused.png",
    tasks: [
      { label: "Update pilot and team communication", working: ["Updating departure…", "Collecting crew replies…"], detail: "Thu 10:30 local · both pilots acknowledged the change", done: "Acknowledged", icon: "people" },
      { label: "Coordinate FBO and airport services", working: ["Revising service times…", "Checking confirmations…"], detail: "Fuel, catering, and handling aligned with the new departure", done: "Confirmed", icon: "plane" },
      { label: "Refresh the shared departure brief", working: ["Updating trip details…", "Sharing the latest brief…"], detail: "TEB → APF · 6 guests · one current brief for every team", done: "Shared", brand: brand.fl3xx },
    ],
    result: "Pilots, dispatch, and ground teams are in sync.",
  },
  {
    key: "review",
    source: "Client update · Operator review",
    message: "Marina wants a later departure and a larger aircraft. Prepare the changes for my approval before sending.",
    sourceBrand: brand.avel,
    avatar: "/assets/personality-avatars/18-focused.png",
    tasks: [
      { label: "Recheck aircraft and schedule fit", working: ["Checking the new time…", "Comparing available aircraft…"], detail: "Six guests · later departure · operator availability checked", done: "Checked", brand: brand.avinode },
      { label: "Prepare the revised quote and plan", working: ["Updating the proposal…", "Checking changed terms…"], detail: "Price difference, departure time, and operator terms summarized", done: "Prepared", icon: "money" },
      { label: "Bring the decision to your team", working: ["Summarizing changes…", "Preparing approval…"], detail: "Revised quote and client reply held for operations review", done: "Reviewed", icon: "people" },
    ],
    review: { afterTask: 2, request: "Approve revised plan", approved: "Plan approved", person: "Jordan · Operations" },
    result: "Approved by your team. Avel carries it forward.",
  },
  {
    key: "booking",
    source: "Marina · Quote accepted",
    message: "The $48,600 quote works. Let’s book Thursday, Teterboro to Naples, for all six of us. Please send the agreement.",
    sourceBrand: brand.gmail,
    avatar: "/assets/personality-avatars/21-graceful.png",
    tasks: [
      { label: "Check acceptance against the quote", working: ["Matching the reply…", "Checking booking details…"], detail: "6 guests · TEB → APF · accepted total $48,600", done: "Matched", icon: "money" },
      { label: "Prepare agreement and collect signature", working: ["Preparing agreement…", "Checking signed copy…"], detail: "Itinerary and cancellation terms matched · signature received", done: "Signed", icon: "file" },
      { label: "Request payment and verify receipt", working: ["Preparing payment request…", "Matching received funds…"], detail: "$48,600 received · payer and booking reference verified", done: "Received", icon: "money" },
      { label: "Confirm the booking and share trip brief", working: ["Checking operator confirmation…", "Sharing the trip brief…"], detail: "Signed agreement and payment verified · booking confirmed", done: "Confirmed", brand: brand.fl3xx },
    ],
    result: "Signed, paid, and confirmed. Marina’s trip is ready.",
  },
  {
    key: "recovery",
    source: "Operator · Aircraft unavailable",
    message: "Our aircraft is unavailable for Marina’s Thursday departure. Please arrange a replacement for the six guests to Naples.",
    sourceBrand: brand.gmail,
    avatar: "/assets/personality-avatars/05-serious.png",
    tasks: [
      { label: "Identify the affected trip and constraints", working: ["Matching operator update…", "Checking trip requirements…"], detail: "Marina · 6 guests · TEB → APF · same departure requested", done: "Checked", brand: brand.fl3xx },
      { label: "Request and compare replacement options", working: ["Requesting availability…", "Comparing operator replies…"], detail: "Global 6000 · same departure · $2,400 additional cost", done: "Compared", brand: brand.avinode },
      { label: "Prepare the replacement for approval", working: ["Checking replacement terms…", "Preparing cost comparison…"], detail: "$48,600 → $51,000 · client consent recorded for review", done: "Prepared", icon: "money" },
      { label: "Confirm replacement and notify everyone", working: ["Confirming the replacement…", "Updating client, crew, and FBO…"], detail: "Operator confirmed · aircraft and service details updated", done: "Updated", icon: "people" },
    ],
    review: { afterTask: 2, request: "Approve $2,400 change", approved: "Replacement approved", person: "Jordan · Operations" },
    result: "Replacement confirmed. Same departure, everyone informed.",
  },
  {
    key: "billing",
    source: "Marina’s trip · Flight completed",
    message: "The Naples trip is complete. Match the supplier invoices, review any extra charges, and prepare Marina’s final bill.",
    sourceBrand: brand.gmail,
    avatar: "/assets/personality-avatars/21-graceful.png",
    tasks: [
      { label: "Match supplier invoices to the trip", working: ["Collecting supplier invoices…", "Matching services and amounts…"], detail: "Aircraft, fuel, handling, and catering matched to TEB → APF", done: "Matched", icon: "file" },
      { label: "Flag duplicates and verify extra charges", working: ["Checking for duplicate charges…", "Verifying approved extras…"], detail: "$650 duplicate flagged · catering $420 + transport $380", done: "Checked", icon: "money" },
      { label: "Prepare the final bill for review", working: ["Reconciling the trip total…", "Preparing billing review…"], detail: "$51,000 flight + $800 extras · duplicate held out of billing", done: "Prepared", icon: "people" },
      { label: "Issue final invoice and close the records", working: ["Applying received payment…", "Filing invoice and trip records…"], detail: "$51,800 total − $48,600 received = $3,200 balance due", done: "Issued", icon: "file" },
    ],
    review: { afterTask: 2, request: "Approve final charges", approved: "Invoice approved", person: "Jordan · Operations" },
    result: "Final invoice issued. $3,200 due, every charge accounted for.",
  },
]
