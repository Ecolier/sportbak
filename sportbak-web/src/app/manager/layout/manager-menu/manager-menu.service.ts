import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SSEProvider} from '../../shared/services/sse.provider';
import {ManagerProvider, ManagerTokenService} from '../../shared/services/manager.service';

export interface MenuItem {
  title: string;
  redirection: string;
  icon?: string;
  action?: () => void;
}

export interface MenuItems {
  [key: string]: MenuItem;
}

@Injectable({
  providedIn: 'root',
})
export class ManagerMenuService {
  constructor(
    private sse: SSEProvider,
    private managerProvider: ManagerProvider,
    private managerTokenService: ManagerTokenService,
  ) {
  }

  serviceMenuItems: MenuItems = {
    // home: { title: 'home', redirection: '/manager/space', icon: 'la-home' }, Keep this commented until we have a real home page
    calendar: {title: 'calendar', redirection: '/manager/day', icon: 'la-calendar'},
    stats: {title: 'stats', redirection: '/manager/statistics', icon: 'la-chart-pie'},
    leagues: {title: 'leagues', redirection: '/manager/leagues', icon: 'la-trophy'},
    tournaments: {title: 'tournaments', redirection: '/manager/tournaments', icon: 'la-sitemap'},
    announcements: {title: 'announcements', redirection: '/manager/announcements', icon: 'la-comment-alt'},
    session: {title: 'session', redirection: '/manager/session', icon: 'la-video'},
    contact: {title: 'contact', redirection: '/manager/contact', icon: 'la-paper-plane'},
  };

  preferenceMenuItems: MenuItems = {
    settings: {title: 'parameter', redirection: '/manager/settings', icon: 'la-cog'},
    space: {title: 'space', redirection: '/manager/space', icon: 'la-user'},
  };

  actionMenuItems: MenuItems = {
    logOut: {
      title: 'log_out', redirection: '', icon: 'la-home', action: () => {
        localStorage.removeItem('user_id');
        this.managerProvider.hasLoaded = false;
        this.managerTokenService.clear();
        this.sse.disconnect();
      },
    },
  };

  private activeMenuItemKey = new BehaviorSubject('home');

  setActiveMenuItemKey(key: string) {
    this.activeMenuItemKey.next(key);
  }

  getActiveMenuItemKey() {
    return this.activeMenuItemKey.asObservable();
  }
}
