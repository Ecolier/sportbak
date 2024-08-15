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
      title: getTranslation('goals'),
      width: '3%',
      key: 'goals',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('assists'),
      width: '3%',
      key: 'assists',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('combined'),
      width: '3%',
      key: 'combined',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('yellow_cards'),
      icon_src: assets.yellowcard,
      width: '2%',
      key: 'yellowcards',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('red_cards'),
      icon_src: assets.redcard,
      width: '2%',
      key: 'redcards',
      defaultSortInverse: false,
      styles: {},
    },
    {
      title: getTranslation('played_time'),
      icon_src: assets.timer,
      width: '3%',
      key: 'playerGameDuration',
      defaultSortInverse: false,
      styles: {},
    },
  ];
  return result;
};

export const ConfrontationsRakingFoot5Template = {
  getTemplate: getTemplate,
};
