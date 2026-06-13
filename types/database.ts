// Hand-written starter types. Replace later with:
//   supabase gen types typescript --project-id <id> > types/database.ts

export type LocationType = "state" | "district" | "constituency" | "mandal" | "village";
export type ContactCategory =
  | "official" | "political" | "elected_rep" | "community_leader" | "religious_leader"
  | "donor" | "corporate_csr" | "media" | "ngo" | "business_vendor" | "professional"
  | "educator" | "youth_volunteer" | "diaspora" | "beneficiary" | "friend";
export type Influence = "high" | "medium" | "low";
export type FundingChannel = "csr" | "psu" | "mp_lads" | "foreign" | "platform" | "govt_scheme";
export type FundingEntity = "gfs" | "synergy" | "bannu_inc" | "bannu_arogyada";
export type FundingStage = "identified" | "drafting" | "submitted" | "in_discussion" | "mou" | "disbursed" | "declined";
export type ProgramTheme = "health" | "education" | "empowerment";
export type ProgramStatus = "planned" | "funded" | "running" | "paused" | "complete";
export type ActivityType = "visit" | "camp" | "meeting" | "event" | "travel";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  category: ContactCategory;
  affiliation?: string;
  designation?: string;
  location_id?: string;
  how_met?: string;
  referred_by?: string;
  email?: string;
  photo_url?: string;
  tags: string[];
  influence?: Influence;
  last_contact?: string;
  next_action?: string;
  next_action_date?: string;
  notes?: string;
}
