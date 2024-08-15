import {Injectable} from '@angular/core';
import {FBKNotificationPushService} from './notification-push.service';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotificationModel} from '../models/notification/notification.model';
import {ManagerProvider, ManagerTokenService} from './manager.service';
import {lastValueFrom} from 'rxjs';
import {Conf} from 'src/app/conf';

type TokenResponse = { value: string, expireAt: Date };

@Injectable({
  providedIn: 'root',
})
export class SSEProvider {
  private eventSource: EventSource;
  private listener: any = {};
  private urlToken: string;
  private urlEventSource: string;
  private retryTimeout = null;
  private token: TokenResponse;

  constructor(
    private http: HttpClient,
    private notificationProvider: FBKNotificationPushService,
    private tokenService: ManagerTokenService,
    private managerProvider: ManagerProvider,
  ) {
    this.urlToken = Conf.apiBaseUrl + '/sse/token';
    this.urlEventSource = Conf.apiBaseUrl + '/sse/websitemanager/subscribe/';
    this.initListener();
  }

  initListener() {
    this.listener.started = this.started.bind(this);
    this.listener.message = this.message.bind(this);
    this.listener.notification = this.notification.bind(this);
  }

  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // -------------------  TOKEN ---------------- //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //

  currTokenIsValid() {
    let result = false;
    if (this.token && this.token.value) {
      const expireAt = this.token.expireAt;
      const now = new Date();
      if (expireAt && expireAt.getTime() > now.getTime()) {
        result = true;
      }
    }
    return result;
  }

  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // -------------------  CONNECT / DISCONNECT ---------------- //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //


  async connect(retry = true, delay = 5000) {
    console.log('Eventsource connect ...');

    let response = null;
    if (!this.currTokenIsValid()) {
      try {
        const headers = new HttpHeaders().set('sportbak-platform', this.managerProvider.getPlatformId());
        response = await lastValueFrom(this.http.get<any>(this.urlToken, {headers}));
        if (response) {
          if (response.token) {
            this.token = {
              value: response.token,
              expireAt: response.expireAt ? new Date(response.expireAt) : null,
            };
          }
        }
      } catch (err) {
        if (err && (err.status === 503 || err.status === 500 || err.status === 404)) {
          retry = false;
        }
        console.log('Eventsource - Error : ', err);
      }
    }

    if (!this.token) {
      if (retry) {
        this.retryToConnect(delay);
      }
      return;
    }


    this.disconnect();
    this.eventSource = new EventSource(this.urlEventSource + this.token.value);
    for (const event in this.listener) {
      this.eventSource.addEventListener(event, this.listener[event]);
    }

    this.eventSource.onerror = (event) => {
      if (this.eventSource.readyState === EventSource.CLOSED) {
        this.retryToConnect(delay);
      }
      if (this.eventSource.readyState === EventSource.CONNECTING) {
      }
    };
  }

  retryToConnect(delay) {
    this.retryTimeout = setTimeout(() => {
      this.clearRetryTimeout();
      this.connect(true, delay);
    }, delay);
  }

  clearRetryTimeout() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  disconnect() {
    this.clearRetryTimeout();
    if (this.eventSource) {
      for (const event in this.listener) {
        this.eventSource.removeEventListener(event, this.listener[event]);
      }
      this.eventSource.close();
    }
  }

  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // -------------------  EVENT ---------------- //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //

  async started(event: MessageEvent) {
    console.log('Eventsource - Started : ', event.data);
  }

  async message(event: MessageEvent) {
    console.log('Eventsource - Message : ', event.data);
  }

  async notification(event: MessageEvent) {
    console.log('Eventsource - Notification : ', event.data);
    let data = null;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
    }

    if (data) {
      console.log('WEB - NOTIFICATION - Notif : ');
      console.log(data);

      const notif = new NotificationModel();
      notif.status = 'inapp';
      notif.title = data.title;
      notif.message = data.message;
      if (data.payload) {
        console.log('WEB - NOTIFICATION - Data : ');
        console.log(data.payload);
        const payload = data.payload.futbak;
        if (payload) {
          notif.setPayload(payload);
        }
        console.log('WEB - NOTIFICATION - Notif model : ');
        console.log(notif);
      }
      await this.notificationProvider.performNotification(notif);
    }
  }
}
