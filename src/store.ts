import { createContext } from 'react';
import type { AppData, Person, Program, Activity, FundingEntry, TeamMember } from './types';

export interface AppContextType {
  data: AppData;
  addPerson: (p: Omit<Person, 'id' | 'createdAt'>) => void;
  deletePerson: (id: string) => void;
  addProgram: (p: Omit<Program, 'id'>) => void;
  deleteProgram: (id: string) => void;
  updateProgramStatus: (id: string, status: Program['status']) => void;
  addActivity: (a: Omit<Activity, 'id'>) => void;
  deleteActivity: (id: string) => void;
  addFunding: (f: Omit<FundingEntry, 'id'>) => void;
  deleteFunding: (id: string) => void;
  addTeamMember: (t: Omit<TeamMember, 'id'>) => void;
  deleteTeamMember: (id: string) => void;
  toggleTeamMemberActive: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);
