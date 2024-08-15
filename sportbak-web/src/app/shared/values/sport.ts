export type SportType = 'foot5' | 'padel' | 'everysport';
export const SportConstants = {
  default: null,
  foot5: {
    name: 'foot5',
    hasGoals: true,
    hasSets: false,
    hasTimer: true,
    hasReferee: true,
    setsNumber: null,
    maxGames: null,
  },
  padel: {
    name: 'padel',
    hasGoals: false,
    hasSets: true,
    hasTimer: false,
    hasReferee: false,
    setsNumber: 3,
    maxGames: 7,
  },
};
