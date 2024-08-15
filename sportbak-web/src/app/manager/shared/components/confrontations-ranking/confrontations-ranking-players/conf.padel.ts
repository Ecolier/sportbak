import {FBKAssetsPaths} from 'src/app/shared/values/assets-paths';
const assets = FBKAssetsPaths.competition;
const getTemplate = function(getTranslation, width) {
  const result = [
    {
      title: getTranslation('rank'),
      width: '4%',
      key: 'rank',
      defaultSortInverse: true,
      styles: {},
    },
    {
      title: getTranslation('players'),
      width: '11%',
      key: 'nickname',
      defaultSortInverse: true,
      styles: {},
    },
    {
      title: getTranslation('games_played'),
      width: '3%',
      key: 'count',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('victories'),
      width: '3%',
      key: 'victory',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('sets_for'),
      width: '3%',
      key: 'sets',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('sets_against'),
      width: '3%',
      key: 'AGsets',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('games_for'),
      width: '3%',
      key: 'games',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('games_against'),
      width: '3%',
      key: 'AGgames',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('games_difference'),
      width: '3%',
      key: 'gamesdiff',
      defaultSortInverse: false,
      styles: {},
    },

  ];
  return result;
};

export const ConfrontationsRakingPadelTemplate = {
  getTemplate: getTemplate,
};
