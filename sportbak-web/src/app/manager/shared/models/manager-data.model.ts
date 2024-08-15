import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {AnnouncementModel} from 'src/app/shared/models/complex/announcementModel';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {UserModel} from 'src/app/shared/models/user/user.model';
import {ApplicationNotificationModel} from './notification/application.notification.model';

export interface ManagerData {
  complex: ComplexModel;
  delayBetweenTwoNotifications: number;
  followers: number;
  leagues: LeagueModel[];
  notifications: AnnouncementModel[];
  tournaments: TournamentModel[];
  user: UserModel;
  platformId: string;
  notifs: ApplicationNotificationModel[];
}
