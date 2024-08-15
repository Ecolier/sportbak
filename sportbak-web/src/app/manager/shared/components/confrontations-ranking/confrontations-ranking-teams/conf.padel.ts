import {FBKAssetsPaths} from 'src/app/shared/values/assets-paths';
const assets = FBKAssetsPaths.competition;
const getTemplate = function(getTranslation, width) {
  let result = null;
  if (width < 600) {
    result = [
      {
        width: '50%',
        tableWidth: '100%',
        scrollable: false,
        columns: [
          {
            title: getTranslation('rank'),
            width: '10%',
            key: 'rank',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('teams'),
            width: '40%',
            key: 'team',
            defaultSortInverse: false,
            styles: {},
          },
        ],
      },
      {
        width: '50%',
        tableWidth: '200%',
        scrollable: true,
        columns: [
          {
            title: getTranslation('games_played'),
            width: '4%',
            key: 'matchsplayed',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('victories'),
            width: '4%',
            key: 'wmatch',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('defeats'),
            width: '4%',
            key: 'lmatch',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('points'),
            width: '6%',
            key: 'points',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('streak'),
            width: '6%',
            key: 'serie',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('sets_for'),
            width: '4%',
            key: 'goal',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('sets_against'),
            width: '4%',
            key: 'tgoal',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('games_for'),
            width: '4%',
            key: 'scoringSetsGames',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('games_against'),
            width: '4%',
            key: 'scoringSetsTGames',
            defaultSortInverse: true,
            styles: {},
          }, {
            title: getTranslation('games_difference'),
            width: '4%',
            key: 'DBscoringSetsGames',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('bonus'),
            icon_src: assets.bonus,
            width: '4%',
            key: 'bonusPoints',
            defaultSortInverse: true,
            styles: {},
          },
        ],
      },
    ];
  } else {
    result = [
      {
        width: '100%',
        tableWidth: '100%',
        scrollable: false,
        columns: [
          {
            title: getTranslation('rank'),
            width: '10%',
            key: 'rank',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('teams'),
            width: '40%',
            key: 'team',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('games_played'),
            width: '4%',
            key: 'matchsplayed',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('victories'),
            width: '4%',
            key: 'wmatch',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('defeats'),
            width: '4%',
            key: 'lmatch',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('sets_for'),
            width: '4%',
            key: 'goal',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('sets_against'),
            width: '4%',
            key: 'tgoal',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('games_for'),
            width: '4%',
            key: 'scoringSetsGames',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('games_against'),
            width: '4%',
            key: 'scoringSetsTGames',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('games_difference'),
            width: '4%',
            key: 'DBscoringSetsGames',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('bonus'),
            icon_src: assets.bonus,
            width: '5%',
            key: 'bonusPoints',
            defaultSortInverse: true,
            styles: {},
          }, {
            title: getTranslation('points'),
            width: '8%',
            key: 'points',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('streak'),
            width: '6%',
            key: 'serie',
            defaultSortInverse: true,
            styles: {},
          },
        ],
      },
    ];
  }
  return result;
};

export const ConfrontationsRakingPadelTemplate = {
  getTemplate: getTemplate,
};
