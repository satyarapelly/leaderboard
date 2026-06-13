import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppData, Person, Program, Activity, FundingEntry, TeamMember } from './types';
import { DEFAULT_DATA } from './data';
import { AppContext } from './store';

const STORAGE_KEY = 'mission2028_data';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // ignore
  }
  return DEFAULT_DATA;
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addPerson = useCallback((p: Omit<Person, 'id' | 'createdAt'>) => {
    setData((d) => ({
      ...d,
      people: [...d.people, { ...p, id: uid(), createdAt: new Date().toISOString().slice(0, 10) }],
    }));
  }, []);

  const deletePerson = useCallback((id: string) => {
    setData((d) => ({ ...d, people: d.people.filter((x) => x.id !== id) }));
  }, []);

  const addProgram = useCallback((p: Omit<Program, 'id'>) => {
    setData((d) => ({ ...d, programs: [...d.programs, { ...p, id: uid() }] }));
  }, []);

  const deleteProgram = useCallback((id: string) => {
    setData((d) => ({ ...d, programs: d.programs.filter((x) => x.id !== id) }));
  }, []);

  const updateProgramStatus = useCallback((id: string, status: Program['status']) => {
    setData((d) => ({
      ...d,
      programs: d.programs.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  }, []);

  const addActivity = useCallback((a: Omit<Activity, 'id'>) => {
    setData((d) => ({ ...d, activities: [...d.activities, { ...a, id: uid() }] }));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setData((d) => ({ ...d, activities: d.activities.filter((x) => x.id !== id) }));
  }, []);

  const addFunding = useCallback((f: Omit<FundingEntry, 'id'>) => {
    setData((d) => ({ ...d, funding: [...d.funding, { ...f, id: uid() }] }));
  }, []);

  const deleteFunding = useCallback((id: string) => {
    setData((d) => ({ ...d, funding: d.funding.filter((x) => x.id !== id) }));
  }, []);

  const addTeamMember = useCallback((t: Omit<TeamMember, 'id'>) => {
    setData((d) => ({ ...d, team: [...d.team, { ...t, id: uid() }] }));
  }, []);

  const deleteTeamMember = useCallback((id: string) => {
    setData((d) => ({ ...d, team: d.team.filter((x) => x.id !== id) }));
  }, []);

  const toggleTeamMemberActive = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      team: d.team.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        addPerson,
        deletePerson,
        addProgram,
        deleteProgram,
        updateProgramStatus,
        addActivity,
        deleteActivity,
        addFunding,
        deleteFunding,
        addTeamMember,
        deleteTeamMember,
        toggleTeamMemberActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
