import {UserModel} from '../../../shared/models/user/user.model';
import {BookingModel} from '../../../shared/models/booking.model';

export interface ModalDataModel {
  booking?: BookingModel;
  user?: UserModel;
}
