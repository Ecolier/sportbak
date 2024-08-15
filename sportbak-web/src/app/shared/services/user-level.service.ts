import {FBKColors} from '../values/colors';
import {TranslateAppProvider} from './translate/translate.service';


const minUserLevel = 1;
const maxUserLevel = 100;

const amateur_max_level = 50; // strictly
const semipro_max_level = 75;
const pro_max_level = maxUserLevel + 1;

export const data = {
  amateur: {
    color: FBKColors.amateur,
    darkColor: FBKColors.amateur_dark,
    icon: 'shoe',
    label: 'service.user_level.amateur',
  },
  semipro: {
    color: FBKColors.semipro,
    darkColor: FBKColors.semipro_dark,
    icon: 'medal',
    label: 'service.user_level.semipro',
  },
  pro: {
    color: FBKColors.pro,
    darkColor: FBKColors.pro_dark,
    icon: 'cup',
    label: 'service.user_level.pro',
  },
  locked: {
    color: FBKColors.locked,
    darkColor: FBKColors.locked_dark,
  },
};

export const defaultUserLevel = minUserLevel;
export const defaultColorLevel = data.amateur.color;
export const defaultDarkColorLevel = data.amateur.darkColor;

export abstract class UserLevelService {
  private static format(level : number) {
    let result = defaultUserLevel;
    if (level >= minUserLevel && level <= maxUserLevel) {
      result = level;
    } else if (level > maxUserLevel) {
      result = maxUserLevel;
    }
    return result;
  }

  private static getCategory(level : number) {
    let category = data.amateur;
    level = this.format(level);
    if (level >= amateur_max_level) {
      if (level >= semipro_max_level) {
        category = data.pro;
      } else {
        category = data.semipro;
      }
    }
    return category;
  }

  public static getColor(level : number) {
    const category = this.getCategory(level);
    return category.color;
  }

  public static getLockedColor() {
    return data.locked.color;
  }

  public static getDarkColor(level : number) {
    const category = this.getCategory(level);
    return category.darkColor;
  }

  public static getLockedDarkColor() {
    return data.locked.color;
  }

  public static getIcon(level : number) {
    const category = this.getCategory(level);
    return category.icon;
  }

  public static getTranslateFullPathForName(level : number) {
    const category = this.getCategory(level);
    return category.label;
  }

  public static async getName(translateAppProvider : TranslateAppProvider, level : number) {
    const fullPath = this.getTranslateFullPathForName(level);
    return await translateAppProvider.getTranslation(fullPath);
  }
}
