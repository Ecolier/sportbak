import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {Field} from 'src/app/shared/models/field.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerTokenService} from '../../shared/services/manager.service';
import {LiveStream, LiveStreamError, LiveStreamService, RTCPeerConnectionState} from '../live-stream/live-stream.service';
import {SessionService} from '../session.service';
import {SessionSettingsService} from 'src/app/manager/settings/settings.service';
import {HydratedSessionSettingsRemote, isHydratedSessionSettings, SessionSettings} from 'src/app/manager/settings/settings.model';
import { ToastService } from 'src/app/shared/components/toast/toast.service';


export type FieldVideoStatus = 'enabled' | 'disabled' | 'unequipped';

@Component({
  selector: 'sbk-session-list-item',
  templateUrl: './session-list-item.component.html',
  styleUrls: ['./session-list-item.component.scss'],
})
export class SessionListItemComponent extends FBKComponent implements OnDestroy {
  @ViewChild('liveStream') liveStreamElementRef?: ElementRef<HTMLMediaElement>;
  @Input() status: FieldVideoStatus = 'disabled';
  @Input() field: Field;

  private readonly ngOnDestroy$ = new Subject<void>();

  isLiveStreamReady = false;
  isLiveStreamConnecting = false;
  isLiveStreamLoaded = false;
  token = this.tokenService.getToken();
  liveStream?: LiveStream;
  settings : HydratedSessionSettingsRemote[];

  constructor(
    private elementRef: ElementRef,
    private translateService: TranslateAppProvider,
    private sessionService: SessionService,
    private sessionSettingsService: SessionSettingsService,
    private tokenService: ManagerTokenService,
    private liveStreamService: LiveStreamService,
    private toastService: ToastService) {
    super(elementRef, translateService, 'SessionListItemComponent');
    this.liveStreamService.loaded$.subscribe((liveStream) => {
      if (this.field?._id == liveStream.fieldId) {
        this.liveStream = liveStream;
        this.isLiveStreamLoaded = true;
        this.isLiveStreamConnecting = true;
        liveStream.connection.ontrack = (event) => {
          if (this.liveStreamElementRef) {
            this.liveStreamElementRef.nativeElement.srcObject = event.streams[0];
            this.liveStreamElementRef.nativeElement.play();
            this.isLiveStreamConnecting = false;
          }
        };
      }
    });

    this.liveStreamService.error$.subscribe((liveStreamError : LiveStreamError) => {
      if (liveStreamError.code == -1) {
        this.toastService.open(this.getTranslation('webRTCErrorLimitReached'), {class: 'error', delay : 4000});
      } else {
        if (this.isLiveStreamLoaded) {
          this.toastService.open(this.getTranslation('webRTCError'), {class: 'error', delay : 6000});
        }
      }
    });

    this.liveStreamService.closed$.subscribe((liveStream) => {
      this.isLiveStreamLoaded = false;
      this.isLiveStreamConnecting = false;
    });

    
    this.liveStreamService.state$.subscribe((liveStream) => {
      if (liveStream?.connection?.connectionState == RTCPeerConnectionState.CONNECTING && 
        !liveStream.alreadyConnected) {
        //this.isLiveStreamConnecting = true;
      } else {
        this.isLiveStreamConnecting = false;
      }
    });
  }

  openLiveStream() {
    if (this.field?._id) {
      if (this.isLiveStreamLoaded) {
        this.liveStreamService.stopWebRTC(this.liveStream);
      } else {
        this.liveStreamService.requestToken(this.field?._id).subscribe((response) => {
          this.liveStreamService.requestLiveStream(this.field?._id, response.token);
        });
      }
    }
  }

  fbkOnInit() {
    if(this.field?._id) {
      this.sessionService.sendCommand(this.field._id, 'webrtc/enabled');
      this.sessionService.onMessage(this.field._id, 'webrtc/enabled').pipe(takeUntil(this.ngOnDestroy$)).subscribe(([field, action, params]) => {
        this.isLiveStreamReady = params?.result;
      });
    }
    this.sessionSettingsService.getAllDefaultSessionSettings().subscribe((settings) => {
      const generals = settings.filter(setting => setting.targetModel == 'Complex');
      this.settings =  settings.filter(setting => setting.target == this.field._id);
      this.settings.push(...generals);
      for (let s of this.settings) {
        if (s.name) {
          if (s.targetModel == 'Complex') {
            s.name = this.getTranslation('global-settings') + s.name;
          }
        } 
      }
    });
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.unsubscribe();
  }
}
