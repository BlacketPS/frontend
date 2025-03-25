// PUBLIC ROUTES
export { default as NotFound } from "./Error/route";

export { default as Home } from "./Home/route";
export { default as Landing } from "./Landing/route";

export { default as Login } from "./Authentication/login.route";
export { default as Register } from "./Authentication/register.route";

export { default as Legal } from "./Legal/route";

// TOP NAVIGATION ROUTES
export { default as Dashboard } from "./Dashboard/route";
export { default as Leaderboard } from "./Leaderboard/route";
export { default as Chat } from "./Chat/route";
export { default as TradingPlaza } from "./TradingPlaza/route";
export { default as Guilds } from "./Guilds/route";
export { default as GuildDiscovery } from "./Guilds/Discovery/route";
export { default as Market } from "./Market/route";
export { default as Inventory } from "./Inventory/route";
export { default as AuctionHouse } from "./AuctionHouse/route";
export { default as Settings } from "./Settings/route";
export { default as News } from "./News/route";

// BOTTOM NAVIGATION ROUTES
export { default as Credits } from "./Credits/route";
export { default as Store } from "./Store/route";

// STAFF ROUTES
export { default as MapEditor } from "./MapEditor/route";
export { default as StaffPanel } from "./Staff/route";
export { default as StaffExperiments } from "./Staff/Experiments/route";

// INTERNAL ROUTES
export { default as SettingsLinkDiscord } from "./Settings/LinkDiscord/route";

// ALIASES
export { default as TermsAlias } from "./Legal/termsAlias.route";
export { default as PrivacyAlias } from "./Legal/privacyAlias.route";
export { default as EulaAlias } from "./Legal/eulaAlias.route";
