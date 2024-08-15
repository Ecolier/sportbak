import * as _ from 'lodash';
import * as moment from 'moment';

// EXEMPLE OF CHILD //
/*

// !! \\ Il est nécessaire de définir les valeurs par défault pour chaque KEY // !! \\
let _default = {
  token : null,
}

export class TokenModel extends FBKModel {
  // !! \\ Il est nécessaire de déclarer les mêmes variables que dans l'object '_default' // !! \\
  // !! \\ Les variables ne doivent pas avoir de valeurs par défaut !!! Elles doivent être déclarer dans l'object '_default' // !! \\

  public token : string;

  constructor(data:any) {
      super(data, _default);
  }
}
*/

export type ObjectId = string;

export abstract class FBKModel {
  private __isFBKModel__ = false;
  private __default__ : any;

  constructor(data: any = {}, _default : any, datesProperties = []) {
    this.__isFBKModel__ = true;
    this.__default__ = _.cloneDeep(_default);
    this.patch(data, this.__default__, datesProperties);
  }

  public patch(data: any, _default : any = null, datesProperties = []) : void {
    this.onBeforePatch(data);
    this._onBeforePatch(data);

    // if (data) {
    //   let props: string[] = Object.keys(_default);
    //   let keys = Object.keys(data);
    //   for (let key of keys) {
    //     if (props.indexOf(key) < 0 && parseInt(key) >= 0) {
    //       delete data[key];
    //     }
    //   }
    // }

    if (_default) {
      _.assign(this, _default, data);
    } else {
      _.assign(this, data);
    }
    this._onAfterPatch(datesProperties);
    this.onAfterPatch();
  }

  public patchAndClone(data: any): any {
    this.patch(data, this.__default__);
    return this;
  }

  public json(): any {
    let data: any = {};
    const props: string[] = Object.getOwnPropertyNames(this);
    _.forEach(props, (key) => {
      if (this[key] instanceof FBKModel) {
        data[key] = this[key].json();
      } else if (_.isDate(this[key])) {
        data[key] = moment(this[key]).format();
      } else if (this[key] != null) {
        data[key] = this[key];
      }
    });


    if (data['__isFBKModel__']) {
      delete data['__isFBKModel__'];
    }
    if (data['__default__']) {
      delete data['__default__'];
    }

    if (this.onAfterParseToJSON) {
      data = this.onAfterParseToJSON(data);
    }
    return data;
  }

  public toJSON(): any {
    return this.json();
  }

  private _onBeforePatch(data): void {
    _.forEach(this.getDateProps(), (propName) => {
      if (data[propName] && !_.isDate(propName)) {
        data[propName] = new Date(data[propName]);
      }
    });
  }

  private _onAfterPatch(datesProperties = []): void {
    if (datesProperties && datesProperties.length) {
      const props: string[] = Object.getOwnPropertyNames(this);
      for (const dateProp of datesProperties) {
        if (props.indexOf(dateProp) >= 0) {
          if (this[dateProp] !== null && ! _.isDate(this[dateProp])) {
            this[dateProp] = new Date(this[dateProp]);
          }
        }
      }
    }
  }

  protected getDateProps(): string[] {
    return [];
  }

  public static isObjectId(value) {
    let result = false;
    if (value) {
      if (typeof value == 'string') {
        if (value.length == 24) {
          if (this.isHex(value)) {
            result = true;
          }
        }
      }
    }
    return result;
  }

  public static objectIsPopulated(value : any) {
    let result = false;
    if (value) {
      if (FBKModel.isObjectId(value)) {
        result = false;
      } else if (value['_id']) {
        if (FBKModel.isObjectId(value['_id'])) {
          result = true;
        }
      }
    }
    return result;
  }

  public static getObjectId(value : any) {
    let result = null;
    if (value) {
      if (FBKModel.isObjectId(value)) {
        result = value;
      } else if (value['_id']) {
        if (FBKModel.isObjectId(value['_id'])) {
          result = value['_id'];
        }
      }
    }
    return result;
  }

  public static isFBKModel(data) {
    let result = false;
    if (data) {
      if (data['__isFBKModel__']) {
        result = true;
      }
    }
    return result;
  }

  public static needToBeConvertToFBKModel(data) {
    let result = false;
    if (data) {
      if (!FBKModel.isFBKModel(data) && FBKModel.objectIsPopulated(data)) {
        result = true;
      }
    }
    return result;
  }

  public static isHex(value : string) {
    let result = false;
    if (value) {
      const regexp = /^[0-9a-fA-F]+$/;
      result = regexp.test(value);
    }
    return result;
  }

  abstract onBeforePatch(data);
  abstract onAfterPatch();
  onAfterParseToJSON?(data) : any;
}
