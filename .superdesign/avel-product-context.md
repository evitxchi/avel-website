# Avel product context for the landing page redesign

## Brand and experience

- Product: Avel aviation operations workspace for private aviation teams.
- Use the Avel marks selected from the supplied brand assets. The Avel application has black and white marks for contrasting surfaces.
- The application UI in the supplied screenshots uses a pale gray canvas, white content panels, black primary controls, quiet gray dividers, and a fixed left navigation. The marketing site can use black, white, and silver while its product recreations retain the screenshot's application structure.
- Use the supplied YD Gothic 130 Pro font for the marketing site. Do not use Hamilton's Aeonik identity in the Avel variation.
- Keep the current Hamilton page's section sequence and broad composition. Replace brand, colors, copy, photography, and product imagery with Avel content.
- Use a slowly moving black, silver, and white hero gradient. Silver glints should be localized and bright enough to read. Preserve strong black or white button fills and contrast. Do not add new calls to action or buttons beyond the source page's positions and the existing controls visible in the app screenshots.
- Scroll motion should feel weighty and deliberate, with restrained momentum and section reveal timing. Respect reduced-motion preferences.

## Product workflows visible in Avel source and supplied screenshots

- Sidebar groups: Overview, Agents, Setup, Shared inbox, Network, Trips, Fleet, Calendar, Projects, Team, Connections, Documents, and Settings.
- Agent library: Avel One, Sales and Customer Revenue, Empty Legs and Network Revenue, and Trip Operations. The library separates Avel agents, employees, Avel One and leads, and expertise.
- Setup: central Avel workspace card with supervised, assisted, and autonomous modes. Communication and flight-operations systems connect to the workspace through a visible topology. Integrations include FMS and communication, document, marketplace, and flight-operations providers.
- Shared inbox: unified operational messages and email, including charter requests and trip conversations. The assistant stays alongside the workspace as a right-hand panel in the supplied screenshots.
- Network, trips, and fleet: operator schedules, fleet, requests, empty legs, schedule gaps, candidate matches, trip status, and constraints. The application source describes the Network view as a sample or repository-backed view. The supplied Network screenshot shows the no-flight-operations-source state and offers a sample network.
- Charter and brokerage visuals should connect requests, origin and destination airports, passengers, aircraft fit, availability, schedule impact, and revenue contribution.
- The requested world map and animated route lines are an illustrative sample-data dashboard recreation. Mark it as sample or simulation unless a connected and validated live source is actually shown.

## Sample data and integration status

The Avel source includes a sample network for demonstration and testing. Sample routes and figures must be clearly labeled as sample data. A provider card or a sample does not establish an active integration.

Avel contains a Stratos provider scaffold, but `lib/aviation/providers/stratos/provider.ts` states that partner API documentation has not been received and that no Stratos operation is wired. Do not claim that Avel and Stratos are integrated or that Avel has a confirmed commercial partnership.

## Stratos Jets research notes

- Stratos Jets is based in Orlando, Florida. Its official leadership page names Joel Thomas as President and CEO.
- Antonio Ferrara is Founder and CEO of The Allied Jet Agency, a Stratos Jet Charters franchise based in Sarasota, Florida.
- If the current layout needs an operator or partnership spotlight, identify the organization accurately and describe it as a prospective relationship or research reference until Avel confirms a signed partnership. Do not label Antonio as CEO of Stratos Jets.
- Primary references: https://www.stratosjets.com/franchise/joel-thomas/joel-thomas/ and https://www.stratosjets.com/franchise/allied-jet-agency/antonio-ferrara/.

## Icon system

The Avel repository already includes `lucide-react`. Use the Lucide outline icon family shown in the added sidebar reference. The icon stroke is consistent, dark charcoal on light surfaces, and used at a restrained size. Map standard library icons to Overview, Agents, Setup, Inbox, Network, Trips, Fleet, Calendar, Projects, Team, Connections, and Documents. Do not draw, invent, or hand-author icons. For the static website implementation, bundle the official Lucide vanilla package and use only named library icons needed by the page and dashboard recreations.
