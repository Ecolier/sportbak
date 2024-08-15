import {Conf} from 'src/app/conf';
import {FBKAssetsPaths} from './assets-paths';

export const FBKStaticUrls = {
  user: {
    picture: {
      base: Conf.staticBaseUrl + '/images/users/',
      guest: FBKAssetsPaths.user.picture.guest,
    },
  },
  shirt: {
    base: Conf.staticBaseUrl + '/teams/shirts/',
    unknown: '/default/shirt_unknown.png',
    empty: Conf.staticBaseUrl + '/teams/shirts/default/shirt_empty.png',
    baseAndUnknown: Conf.staticBaseUrl + '/teams/shirts/default/shirt_unknown.png',
  },
  complex: {
    logo: {
      normal: Conf.staticBaseUrl + '/images/complexes/logos/',
      unknown: Conf.staticBaseUrl + '/images/complexes/logos/NO-LOGO.jpg',
    },
  },
  logo: {
    base: Conf.staticBaseUrl + '/images/logos/',
  },
};
