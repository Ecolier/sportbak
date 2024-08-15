import {Injectable} from '@angular/core';
import {NotificationModel} from '../models/notification/notification.model';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';

@Injectable({
  providedIn: 'root',
})
export class FBKNotificationPushService {
  private notificationToPerform: NotificationModel;

  constructor(
    private eventsService: SBKEventsProvider,
  ) {
  }


  public async performNotification(notif: NotificationModel) {
    const redirected = false;

    if (notif) {
      const payload = notif.payload;
      const status = notif.status;
      const reloadingApp = false;

      /* if (!this.dataProvider.isLoaded) {
        this.notificationToPerform = notif;
      } else {
        if (payload && payload.reload) {
          let reload = payload.reload;
          if ((status == 'tapping' || !reload.onlyOnTappingNotification) && notif != this.notificationToPerform) {
            if (reload.app) {
              await this.dataProvider.reloadApp(this.navCtrl);
              this.notificationToPerform = notif;
              reloadingApp = true;
            } else if (reload.home) {
              if (status == 'tapping') {
                await this.loadingProvider.showLoader();
              }
              let input = await HomeInputRequestModel.generate(true, this.geolocationProvider);
              let promise = new Promise((resolve, reject) => {
                this.requestProvider.getHome(input).subscribe(response => {
                  this.dataProvider.initVariablesFromGetHome(response);
                  resolve(response);
                }, error => {
                  resolve(null);
                });
              });
              await promise;
              if (status == 'tapping') {
                this.loadingProvider.hideLoader();
              }
            } else if (!reload.allHomeValuesAreFalse()) {
              if (status == 'tapping') {
                await this.loadingProvider.showLoader();
              }
              let input = await HomeInputRequestModel.generate(true, this.geolocationProvider);
              let promise = new Promise((resolve, reject) => {
                this.requestProvider.getHome(input, reload.badges, reload.user,
                  reload.summary, reload.games, reload.version, reload.relationShipUser,
                  reload.relationShipComplex, reload.agreements, reload.notifications, reload.informations).subscribe(response => {
                  this.dataProvider.initVariablesFromGetHome(response);
                  resolve(response);
                }, error => {
                  resolve(null);
                });
              });
              await promise;
              if (status == 'tapping') {
                this.loadingProvider.hideLoader();
              }
            }
          }
        }

        if (!reloadingApp) {
          redirected = await this.redirectIfNeeded(notif);
          await this.showToastIfNeeded(notif);

          this.eventsProvider.publish(FBKEventsIds.notification, notif);
        }
      }*/
      this.eventsService.publish(SBKEventsIds.notifications, notif);
    }
    return redirected;
  }

  private alreadyInPageToRedirect(notif: NotificationModel) {
    /*      let result = false;
          if (notif) {
              let payload = notif.payload;
              if (payload) {
                  if (payload.redirections && payload.redirections.length) {
                      let lastRedirection = payload.redirections[payload.redirections.length - 1];
                      if (FBKNavigationService.isSameCurrentPath(lastRedirection.url) || this.isBookingBlacklist(lastRedirection.url)) {
                          result = true;
                      }
                  }
              }
          }
          console.log("alreadyInPageToRedirect : " + result);
          return result;*/
    return false;
  }

  private canRedirect(notif: NotificationModel, force: boolean = false) {
    /* let result = false;
    if (notif) {
       let status = notif.status;
       let payload = notif.payload;
       if (payload) {
           if (payload.redirections) {
               for (let redirection of payload.redirections) {
                   if (status == 'tap
                   ping' || !redirection.onlyOnTappingNotification || force) { // redirection only if user click on notif outside of app
                       result = true;
                       break;
                   }
               }
           }
       }
   }*/
    return false;
  }

  private async redirectIfNeeded(notif: NotificationModel, force: boolean = false) {
    const redirected = false;
    /* if (notif) {
        let status = notif.status;
        let payload = notif.payload;
        if (payload) {
            if (payload.redirections) {
                for (let redirection of payload.redirections) {
                    let navigationOptions = {
                        state : redirection.inputs
                    }
                    if (status == 'tapping' || !redirection.onlyOnTappingNotification || force) { // redirection only if user click on notif outside of app
                        if (payload.sport){
                            if (FBKMultisportsService.isValidSport(payload.sport, false)) {
                                if (payload.sport == this.multisports.sport || payload.sport == "everysport"){
                                    if (redirection.atRoot) {
                                        await FBKNavigationService.setRoot(this.navCtrl, redirection.url, navigationOptions);
                                    } else {
                                        await FBKNavigationService.push(this.navCtrl, redirection.url, navigationOptions);
                                    }
                                }
                                else {
                                    this.dataProvider.reloadApp(this.navCtrl, payload.sport, true, redirection.url);
                                }
                            } else {
                                let updateAppUrl = this.platformProvider.getUpdateApplicationUrl();
                                let skipButton : FBKAlertButton = {text : await this.translateProvider.getTranslation('provider.notifications.updateAppPopUpSkipButton'), handler: () => {}};
                                let updateButton : FBKAlertButton = {text : await this.translateProvider.getTranslation('provider.notifications.updateAppPopUpUpdate'), handler: () => {
                                  this.platformProvider.openUpdateApplicationUrl();
                                }};
                                let buttons = [skipButton];
                                if (updateAppUrl) {
                                  buttons.push(updateButton);
                                }
                                this.alertProvider.openAlert(await this.translateProvider.getTranslation("provider.notifications.updateAppPopUpTitle"), await this.translateProvider.getTranslation("provider.notifications.updateAppPopUpMessage"),
                                buttons);
                            }

                        }
                        redirected = true;
                    }
                }
            }
        }
    }*/
    return redirected;
  }

  private async showToastIfNeeded(notif: NotificationModel, useRedirection = true) {
    const showed = false;
    /* if (notif) {
        let payload = notif.payload;
        let status = notif.status;
        if (payload) {
            let toast = payload.toast;
            if (toast) {
                this.alreadyInPageToRedirect(notif)
                if (toast.enabled && (!toast.onlyDifferentPage || !this.alreadyInPageToRedirect(notif))) {
                    if (status == 'inapp' || !toast.onlyInApp) { // redirection only if user click on notif outside of app
                        let message = toast.message;
                        let title = toast.title;
                        if (!message) {
                            message = notif.message;
                        }
                        if (!title) {
                            title = notif.title;
                        }
                        let callbackRedirection = null;
                        if (useRedirection) {
                            if (this.canRedirect(notif, true)) {
                                callbackRedirection = () => {
                                    this.redirectIfNeeded(notif, true);
                                }
                            }
                        }
                        if (message != null) {
                            ToastService.presentToastNotification(this.toastCtrl, this.translateProvider, message, title, callbackRedirection);
                        }
                    }
                }
            }
        }
    }*/
    return showed;
  }
}
