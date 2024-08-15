import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CloseType } from '../shared/components/popup/popup.component';
import { WebRTCError } from '../shared/components/webRTCPlayer/webRTCPlayer.component';
import { bufferDebounce } from '../shared/operators/buffer-debounce';
import { ConfigService } from '../shared/services/config.service';
import { Action, GamepadService, KeyBindings, KeyboardKeyBindings } from '../shared/services/gamepad.service';
import { LiveStreamService } from '../shared/services/live-stream.service';
import { SocketService } from '../shared/services/socket.service';
import { User, UserService } from '../shared/services/user.service';
import { Status, StatusService } from './status.service';

type DetailStyle = { style?: any, v: string };
type PopupInput = {title : string, message : string, buttonGreen? : string, buttonRed? : string, buttonBlue? : string, buttonWhite? : string};

type Dataset = {
  style?: any,
  sections: {
    style?: any,
    title: string | DetailStyle,
    rows: {
      style?: any,
      title: string | DetailStyle,
      value: string | DetailStyle,
    }[]
  }[]
}[];

@Component({
  selector: 'sbk-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnDestroy {
  private pressedButtons = new Map<Action, boolean>();
  private delayedActionInterval?: number;
  private counterAction: number = 0;

  private gamepadConnected: boolean = false;
  private gamepadKeyBindings: KeyBindings;
  private keyboardKeyBindings: KeyboardKeyBindings;
  private user: User | null = null;
  private status: Partial<Status> = {};

  private buttonGamepadIndexPressed: number | null = null;
  private keyKeyboardPressed: string | null = null;

  private subscriptions: Subscription[] = [];
  private listeners: ({ type: string, callback: (event: any) => void })[] = [];

  private _isLiveFeedbackVisible = false;
  get isLiveFeedbackVisible() {
    return this._isLiveFeedbackVisible;
  }
  public webRTCToken : string | null = null;

  popupInput : PopupInput= {title : "", message : ""};
  showPopupConfirmationResetConfiguration: boolean = false;
  showPopupConfirmationReboot: boolean = false;
  showPopupConfirmationShutdown : boolean = false;
  showPopupSelectShutdownMode : boolean = false;
  dataset: Dataset | [];

  constructor(
    private location: Location,
    public statusService: StatusService,
    private socketService: SocketService,
    private userService: UserService,
    private gamepadService: GamepadService,
    public configService: ConfigService,
    private liveStreamService: LiveStreamService,
    private http: HttpClient) {

    let sub = null;

    this.statusService.getStatus();
    sub = this.statusService.status.subscribe(status => {
      this.status = { ...this.status, ...status };
      this.updateDataset();
    });
    this.subscriptions.push(sub);

    sub = this.userService.user$.subscribe((u) => {
      this.user = u;
    });
    this.subscriptions.push(sub);

    this.gamepadConnected = this.gamepadService.gamepadIsConnected();
    this.gamepadKeyBindings = this.gamepadService.getKeysBinding();
    this.keyboardKeyBindings = this.gamepadService.getKeyboardKeysBinding();

    this.dataset = [];

    sub = this.gamepadService.buttonDown$.pipe(bufferDebounce(100)).subscribe(actions => {

      if (this.showingPopup())
        return;

      actions.forEach(action => this.pressedButtons.set(action, true));

      if (this.pressedButtons.get('goalTeam1') &&
        this.pressedButtons.get('goalTeam2') && 
        this.delayedActionInterval === undefined) {
        this.clearTimerButtonLockDown();
        this.delayedActionInterval = window.setInterval(() => {
          this.counterAction++;
          if (this.counterAction > 2) {
            this.selectShutdownMode();
            this.clearTimerButtonLockDown();
          }
        }, 200);
      } else if (this.pressedButtons.get('var') &&
        this.pressedButtons.get('buzz') &&
        this.delayedActionInterval === undefined) {
        this.clearTimerButtonLockDown();
        this.delayedActionInterval = window.setInterval(() => {
          this.counterAction++;
          if (this.counterAction > 2) {
            this.showStreaming();
            this.clearTimerButtonLockDown();
          }
        }, 200);
      } else if (this.pressedButtons.get('up') &&
        this.pressedButtons.get('down') &&
        this.delayedActionInterval === undefined) {
        this.clearTimerButtonLockDown();
        this.delayedActionInterval = window.setInterval(() => {
          this.counterAction++;
          if (this.counterAction > 2) {
            this.askConfirmationResetConfiguration();
            this.clearTimerButtonLockDown();
          }
        }, 200);
      } else if (this.pressedButtons.get('return')) {
        if (this.isLiveFeedbackVisible) {
          this.stopStreaming();
        } else {
          this.back();
        }
      }
    });
    this.subscriptions.push(sub);

    sub = this.gamepadService.buttonUp$.pipe(bufferDebounce(100)).subscribe(actions => {
      actions.forEach(action => this.pressedButtons.set(action, false));
      this.clearTimerButtonLockDown();
    });
    this.subscriptions.push(sub);

    sub = this.gamepadService.buttonDownGamepadIndex$.pipe(bufferDebounce(100)).subscribe(indexes => {
      this.buttonGamepadIndexPressed = indexes.length ? indexes[0] : null;
      this.updateDataset();
    });
    this.subscriptions.push(sub);

    sub = this.gamepadService.buttonUpGamepadIndex$.pipe(bufferDebounce(100)).subscribe(indexes => {
      if (indexes.length && this.buttonGamepadIndexPressed !== null) {
        this.buttonGamepadIndexPressed = null;
        this.updateDataset();
      }
    });
    this.subscriptions.push(sub);

    sub = this.gamepadService.gamepadConnected$.subscribe(connected => {
      if (this.gamepadConnected != connected) {
        this.gamepadConnected = connected;
        this.updateDataset();
      }
    });
    this.subscriptions.push(sub);


    this.listeners.push({
      type: 'keydown',
      callback: (event: KeyboardEvent) => {
        const key: string = event.key;
        this.keyKeyboardPressed = key;
        this.updateDataset();
      }
    });

    this.listeners.push({
      type: 'keyup',
      callback: (event: KeyboardEvent) => {
        const key: string = event.key;
        if (this.keyKeyboardPressed !== null) {
          this.keyKeyboardPressed = null;
          this.updateDataset();
        }
      }
    });

    for (let listener of this.listeners) {
      document.addEventListener(listener.type, listener.callback);
    }


    this.updateDataset();
  }

  updateDataset() {
    this.gamepadConnected = this.gamepadService.gamepadIsConnected();
    this.gamepadKeyBindings = this.gamepadService.getKeysBinding();
    this.keyboardKeyBindings = this.gamepadService.getKeyboardKeysBinding();

    this.dataset = [{ // column 1
      style: { flex: 2 },
      sections: [{
        title: "Environnement",
        rows: [{
          title: "Complex",
          value: this.user?.complex?.name ? this.user?.complex?.name : "-"
        }, {
          title: "Terrain",
          value: this.user?.field?.name ? this.user?.field?.name : "-"
        }, {
          title: "Terrain - ID",
          value: this.user?.field?.id ? this.user?.field?.id : "-"
        }]
      }, {
        title: "Connectivité",
        rows: [{
          title: "Adresse IP",
          value: this.status?.localIPAddress ? this.status?.localIPAddress : "-"
        }, {
          title: "VPN - Adresse IP",
          value: this.status?.vpnIpAddress ? this.status?.vpnIpAddress : "-"
        }, /*{
            title : "Connecté à internet",
            value : this.statusService.online ? 'OK' : 'NOT OK'
          }, {
            title : "Connecté au service vidéo",
            value : this.statusService.videoServiceConnection ? 'OK' : 'NOT OK'
          },*/ {
          title: "Connecté au gamepad",
          value: this.gamepadConnected ? 'OK' : 'NOT OK'
        }]
      }, {
        title: "Paramètres",
        rows: [{
          title: "Envoyer les vidéos directement",
          value: this.status?.sendsVideoImmediately !== undefined ? (this.status?.sendsVideoImmediately ? 'OK' : 'NOT OK') : "-"
        }, {
          title: "Heure d'envoie",
          value: this.status?.videoSendTime !== undefined ? this.status?.videoSendTime : "-"
        }, {
          title: "Vidéo bitrate",
          value: this.status?.bitrate !== undefined ? this.status?.bitrate + '' : '-',
        }, {
          title: "Vidéo height",
          value: this.status?.height !== undefined ? this.status?.height + '' : '-',
        }, {
          title: "Vidéo temps buzz",
          value: this.status?.buzzTime !== undefined ? this.status?.buzzTime + '' : '-',
        }, {
          title: "Vidéo temps var",
          value: this.status?.varTime !== undefined ? this.status?.varTime + '' : '-',
        }, {
          title: "Lancer une session",
          value: this.status?.launchSessionFromFrontend !== undefined ? (this.status?.launchSessionFromFrontend ? 'OK' : 'NOT OK') : "-"
        }, {
          title: "Lancer une session avec E",
          value: this.status?.launchSessionFromFrontendWithWarmup !== undefined ? (this.status?.launchSessionFromFrontendWithWarmup ? 'OK' : 'NOT OK') : "-"
        }, {
          title: "Pause une session",
          value: this.status?.pauseSessionFromFrontend !== undefined ? (this.status?.pauseSessionFromFrontend ? 'OK' : 'NOT OK') : "-"
        }, {
          title: "Stop une session",
          value: this.status?.stopSessionFromFrontend !== undefined ? (this.status?.stopSessionFromFrontend ? 'OK' : 'NOT OK') : "-"
        }]
      }]
    }, { // column 2
      style: { flex: 1 },
      sections: [{
        title: "Gamepad",
        rows: [{
          title: "But team 1",
          value: this.gamepadKeyBindings.goalTeam1 + ''
        }, {
          title: "But team 2",
          value: this.gamepadKeyBindings.goalTeam2 + ''
        }, {
          title: "Buzz",
          value: this.gamepadKeyBindings.buzz + ''
        }, {
          title: "Var",
          value: this.gamepadKeyBindings.var + ''
        }, {
          title: "Up",
          value: this.gamepadKeyBindings.up + ''
        }, {
          title: "Down",
          value: this.gamepadKeyBindings.down + ''
        }, {
          title: "Retour",
          value: this.gamepadKeyBindings.return + ''
        }, {
          title: {
            style: { color: "orange", fontSize: "1.5em", marginTop: "2%" },
            v: "Pressing..."
          },
          value: {
            style: { color: "orange", fontSize: "1.5em" },
            v: this.buttonGamepadIndexPressed === null ? "-" : (this.buttonGamepadIndexPressed + '')
          },
        }]
      }]
    }, { // column 3
      style: { flex: 1 },
      sections: [{
        title: "Keyboard",
        rows: [{
          title: "But team 1",
          value: this.keyboardKeyBindings.goalTeam1
        }, {
          title: "But team 2",
          value: this.keyboardKeyBindings.goalTeam2
        }, {
          title: "Buzz",
          value: this.keyboardKeyBindings.buzz
        }, {
          title: "Var",
          value: this.keyboardKeyBindings.var
        }, {
          title: "Up",
          value: this.keyboardKeyBindings.up
        }, {
          title: "Down",
          value: this.keyboardKeyBindings.down
        }, {
          title: "Retour",
          value: this.keyboardKeyBindings.return
        }, {
          title: {
            style: { color: "orange", fontSize: "1.5em", marginTop: "2%" },
            v: "Pressing..."
          },
          value: {
            style: { color: "orange", fontSize: "1.5em" },
            v: this.keyKeyboardPressed ? this.keyKeyboardPressed : "-"
          },
        }]
      }]
    }];
  }

  getStyle(data : string | DetailStyle) : any {
    let result = null;
    if (typeof data !== "string") {
      result = data.style;
    }
    return result;
  }

  getValue(data : string | DetailStyle) : string {
    let result = null;
    if (typeof data === "string") {
      result = data;
    } else {
      result = data.v;
    }
    return result;
  }

  clearTimerButtonLockDown() {
    if (this.delayedActionInterval) window.clearInterval(this.delayedActionInterval);
    this.delayedActionInterval = undefined;
    this.counterAction = 0;
  }

  // ----------- POPUP ----------- //

  showingPopup() {
    return this.showPopupConfirmationResetConfiguration || this.showPopupConfirmationReboot || 
    this.showPopupConfirmationShutdown || this.showPopupSelectShutdownMode;
  }

  askConfirmationResetConfiguration() {
    this.popupInput = {
      title : "Êtes-vous sûr ?",
      message : "Êtes-vous sûr de vouloir réinitialiser les paramêtres du système ?",
      buttonRed : "Non",
      buttonGreen : "Yes"
    };
    this.showPopupConfirmationResetConfiguration = true;
  }

  askConfirmationReboot() {
    this.popupInput = {
      title : "Êtes-vous sûr ?",
      message : "Êtes-vous sûr de vouloir redémarrer le système ?",
      buttonRed : "Non",
      buttonGreen : "Yes"
    };
    this.showPopupConfirmationReboot = true;
  }

  askConfirmationShutdown() {
    this.popupInput = {
      title : "Êtes-vous sûr ?",
      message : "Êtes-vous sûr de vouloir arrêter le système ?",
      buttonRed : "Non",
      buttonGreen : "Yes"
    };

    this.showPopupConfirmationShutdown = true;
  }

  selectShutdownMode() {
    this.popupInput = {
      title : "Que voulez-vous faire ?",
      message : "Voulez-vous arrêter ou redémarrer le système ?",
      buttonRed : "Annuler",
      buttonBlue : "Arrêter",
      buttonWhite : "Redémarrer"
    };
    this.showPopupSelectShutdownMode = true;
  }

  outputPopup(type: CloseType) {
    console.log("OutputPopup : " + type)
    if (this.showPopupConfirmationResetConfiguration) {
      if (type == 'green-button') {
        this.resetConfiguration();
      }
      this.showPopupConfirmationResetConfiguration = false;
    } else if (this.showPopupConfirmationReboot) {
      if (type == 'green-button') {
        this.reboot();
      }
      this.showPopupConfirmationReboot = false;
    } else if (this.showPopupConfirmationShutdown) {
      if (type == 'green-button') {
        this.shutdown();
      }
      this.showPopupConfirmationShutdown = false;
    } else if (this.showPopupSelectShutdownMode) {
      this.showPopupSelectShutdownMode = false;
      if (type == 'blue-button') {
        this.askConfirmationShutdown();
      } else if (type == 'white-button') {
        this.askConfirmationReboot();
      }
    }
  }

  // ----------- ACTIONS ----------- //

  showStreaming() {
    console.log("Show streaming ...");
    // get token
    this.http.get('http://' + this.configService.videoServiceEndpoint + '/webrtc/scorerfrontend/token').subscribe((data : any) => {
      if (data) {
        this.webRTCToken = data.token;
        this._isLiveFeedbackVisible = true;
      }
    }, error => {});
  }

  stopStreaming() {
    this._isLiveFeedbackVisible = false;
  }

  webRTCError(error : WebRTCError) {
    console.log("WebRTC error : " + error.message);
    this._isLiveFeedbackVisible = false;
  }

  resetConfiguration() {
    console.log("Reset configuration ...");
    this.socketService.send('admin/reset/apikeys');
  }

  back() {
    console.log("Back ...");
    this.location.back();
  }
  reboot() {
    console.log("Reboot ...");
    this.socketService.send('admin/reboot');
  }
  shutdown() {
    console.log("Shutdown ...");
    this.socketService.send('admin/stop');
  }

  // ----------- DESTROY ----------- //

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }

    for (let listener of this.listeners) {
      document.removeEventListener(listener.type, listener.callback);
    }
  }
}
