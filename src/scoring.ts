import type { AppData, MandalScore } from './types';

export function computeMandalScores(data: AppData): MandalScore[] {
  return data.mandals
    .map((mandal): MandalScore => {
      const mid = mandal.id;
      const peopleCount = data.people.filter((p) => p.mandalId === mid).length;
      const programsCount = data.programs.filter((p) => p.mandalId === mid).length;
      const activitiesCount = data.activities.filter((a) => a.mandalId === mid && a.status === 'completed').length;
      const completedPrograms = data.programs.filter((p) => p.mandalId === mid && p.status === 'completed').length;
      const totalFunding = data.funding
        .filter((f) => f.mandalId === mid)
        .reduce((s, f) => s + f.amount, 0);

      // Scoring formula:
      // people × 5 + programs × 20 + completedPrograms × 30 + activities × 15 + funding / 100000 × 2
      const score =
        peopleCount * 5 +
        programsCount * 20 +
        completedPrograms * 30 +
        activitiesCount * 15 +
        Math.floor(totalFunding / 100000) * 2;

      return { mandal, peopleCount, programsCount, activitiesCount, completedPrograms, totalFunding, score, rank: 0 };
    })
    .sort((a, b) => b.score - a.score)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}
