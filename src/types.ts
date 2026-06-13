export type MandalId = string;

export interface Mandal {
  id: MandalId;
  name: string;
  district: string;
  constituency: string;
  population?: number;
  villages?: number;
}

export type PersonRole = 'constituent' | 'volunteer' | 'beneficiary' | 'leader';

export interface Person {
  id: string;
  name: string;
  phone?: string;
  mandalId: MandalId;
  village?: string;
  role: PersonRole;
  createdAt: string;
  notes?: string;
}

export type ProgramStatus = 'planned' | 'ongoing' | 'completed' | 'paused';
export type ProgramCategory =
  | 'infrastructure'
  | 'welfare'
  | 'health'
  | 'education'
  | 'agriculture'
  | 'youth'
  | 'women'
  | 'other';

export interface Program {
  id: string;
  name: string;
  description?: string;
  mandalId: MandalId;
  status: ProgramStatus;
  category: ProgramCategory;
  budget: number;
  beneficiaries: number;
  startDate: string;
  endDate?: string;
}

export type ActivityType = 'meeting' | 'event' | 'survey' | 'outreach' | 'inauguration' | 'other';
export type ActivityStatus = 'planned' | 'completed' | 'cancelled';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  type: ActivityType;
  mandalId: MandalId;
  date: string;
  attendees: number;
  status: ActivityStatus;
}

export type FundingType = 'allocated' | 'released' | 'spent';

export interface FundingEntry {
  id: string;
  programId?: string;
  description: string;
  amount: number;
  source: string;
  date: string;
  type: FundingType;
  mandalId: MandalId;
}

export interface TeamMember {
  id: string;
  name: string;
  phone?: string;
  role: string;
  mandalId: MandalId;
  joinDate: string;
  isActive: boolean;
}

export interface MandalScore {
  mandal: Mandal;
  peopleCount: number;
  programsCount: number;
  activitiesCount: number;
  completedPrograms: number;
  totalFunding: number;
  score: number;
  rank: number;
}

export interface AppData {
  mandals: Mandal[];
  people: Person[];
  programs: Program[];
  activities: Activity[];
  funding: FundingEntry[];
  team: TeamMember[];
}
