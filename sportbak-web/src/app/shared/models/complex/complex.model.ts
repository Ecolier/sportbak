import {Field} from 'src/app/shared/models/field.model';
import {FBKStaticUrls} from '../../values/static-urls';
import {FBKModel, ObjectId} from '../futbak-parent-model';
import {BookingSettingsModel} from './booking-settings.model';
import {ComplexFullAddressModel} from './complex-fullAddress.model';

const _default = {
  _id: null,
  name: null,
  address: null,
  latitude: null,
  longitude: null,
  phone: null,
  logo: FBKStaticUrls.complex.logo.unknown,
  status: null,
  image: null,
  opening: [],
  fields: [],
  sport: [],
  bookingSettings: null,
};

export class ComplexModel extends FBKModel {
    public _id: ObjectId;
    public name: string;
    public address: ComplexFullAddressModel;
    public latitude: number;
    public longitude: number;
    public phone: string;
    public logo: string;
    public status: string;
    public image: string;
    public socialNetwork: any;

    fields: Field[];
    opening: any[];
    sport: string[];
    bookingSettings: BookingSettingsModel;
    constructor(data: any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      this.address = new ComplexFullAddressModel(this.address);
    }

    public getFormattedAddress(withCountry = false) {
      let result = '';
      if (this.address) {
        result = this.address.street + ' ' + this.address.zipcode + ' ' + this.address.city;
        if (withCountry) {
          result += ' - ' + this.address.country;
        }
      }
      return result;
    }

    public getDayOpening(dayOfWeek: number) {
      if (dayOfWeek == 0) {
        return this.opening.find((opening) => opening.subtype == 'sunday');
      } else if (dayOfWeek == 1) {
        return this.opening.find((opening) => opening.subtype == 'monday');
      } else if (dayOfWeek == 2) {
        return this.opening.find((opening) => opening.subtype == 'tuesday');
      } else if (dayOfWeek == 3) {
        return this.opening.find((opening) => opening.subtype == 'wednesday');
      } else if (dayOfWeek == 4) {
        return this.opening.find((opening) => opening.subtype == 'thursday');
      } else if (dayOfWeek == 5) {
        return this.opening.find((opening) => opening.subtype == 'friday');
      } else {
        return this.opening.find((opening) => opening.subtype == 'saturday');
      }
    }
}
