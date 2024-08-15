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
            title: getTranslation('draws'),
            width: '4%',
            key: 'dmatch',
            defaultSortInverse: false,
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
            title: getTranslation('goals_for'),
            width: '4%',
            key: 'goal',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('goals_against'),
            width: '4%',
            key: 'tgoal',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('goal_difference'),
            width: '4%',
            key: 'DBgoals',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('yellow_cards'),
            icon_src: assets.yellowcard,
            width: '4%',
            key: 'yellowcards',
            defaultSortInverse: true,
            styles: {},
          }, {
            title: getTranslation('red_cards'),
            icon_src: assets.redcard,
            width: '4%',
            key: 'redcards',
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
            title: getTranslation('draws'),
            width: '4%',
            key: 'dmatch',
            defaultSortInverse: false,
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
            title: getTranslation('goals_for'),
            width: '4%',
            key: 'goal',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('goals_against'),
            width: '4%',
            key: 'tgoal',
            defaultSortInverse: false,
            styles: {},
          },
          {
            title: getTranslation('goal_difference'),
            width: '4%',
            key: 'DBgoals',
            defaultSortInverse: true,
            styles: {},
          },
          {
            title: getTranslation('yellow_cards'),
            icon_src: assets.yellowcard,
            width: '5%',
            key: 'yellowcards',
            defaultSortInverse: true,
            styles: {},
          }, {
            title: getTranslation('red_cards'),
            icon_src: assets.redcard,
            width: '5%',
            key: 'redcards',
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

export const ConfrontationsRakingFoot5Template = {
  getTemplate: getTemplate,
};
