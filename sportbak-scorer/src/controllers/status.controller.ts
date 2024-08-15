import imageVersions from '../config/image.version';
import { SocketCommandesMessageAction } from '../constants/socket.commandes.action.constant';
import ContextService from '../services/context.service';

export interface Status {
  localIPAddress: string;
  internetConnection: boolean;
  estimatedDownloadRate: number;
  vpnIPAddress: string;
  videoServiceConnection: boolean;
  gamepadConnection: boolean;
  cameraConnection: boolean;
  USBConnection: boolean;
  HDMIConnection: boolean;
  sendsVideoImmediately: boolean;
  videoSendTime: string;
  bitrate: number;
  height: number;
  buzzTime: number;
  varTime : number;
  deleteVideo: number;
  launchSessionFromFrontend : boolean;
  launchSessionFromFrontendWithWarmup : boolean;
}

export class StatusController {
  constructor(
    private contextService: ContextService) {
    /*this.contextService.statusService.pollUSBDevices().subscribe(event => {
      console.log('USB event', event);
      if (event.type === 'add') this.broadcastStatus({ USBConnection: true });
      if (event.type === 'remove') this.broadcastStatus({ USBConnection: false });
    });*/
  }

  private async getStatusParams(status?: Partial<Status>) {
    const localIPAddress = this.contextService.statusService.getLocalIPAddress();
    const vpnIpAddress = this.contextService.statusService.getVpnIpAddress();
    const config = this.contextService.configService.read();
    const params = {
      localIPAddress: localIPAddress,
      vpnIpAddress : vpnIpAddress,
      internetConnection: await this.contextService.statusService.getInternetConnection(),
      estimatedDownloadRate: 0,//await this.contextService.statusService.getEstimatedDownloadRate(),
      sendsVideoImmediately: config.sendVideoAsSoon,
      videoSendTime : config.dailySendHour,
      bitrate: config.bitrate,
      height: config.height,
      buzzTime: config.buzzTime,
      varTime : config.varTime,
      deleteVideo: config.deleteVideo,
      launchSessionFromFrontend : config.launchSessionFromFrontend,
      launchSessionFromFrontendWithWarmup : config.launchSessionFromFrontendWithWarmup,
      pauseSessionFromFrontend : config.pauseSessionFromFrontend,
      stopSessionFromFrontend : config.stopSessionFromFrontend,
      ...status
    };
    return params;
  }

  async sendStatus(socket: any, status?: Partial<Status>) : Promise<boolean> {
    const params = await this.getStatusParams(status);
    return this.contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.STATUS, params);
  }

  async broadcastStatus(status?: Partial<Status>) {
    const params = await this.getStatusParams(status);
    return this.contextService.socketCommandesService.broadcast(this.contextService, SocketCommandesMessageAction.STATUS, params);
  }

  async sendIpAddesses(socket: any) : Promise<boolean> {
    const localIPAddress = this.contextService.statusService.getLocalIPAddress();
    const vpnIpAddress = this.contextService.statusService.getVpnIpAddress();
    const params : any = {
      localIPAddresses : localIPAddress,
      vpnIpAddress : vpnIpAddress,
    };
    return this.contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.STATUS_IP_ADDRESSES, params);
  }

  sendVersions(socket) : boolean {
    const versions = {
      backend : imageVersions.manager_backend_version,
      worker : imageVersions.manager_worker_version,
      frontend : imageVersions.manager_frontend_version,
      video : imageVersions.videoapp_version
    };
    return this.contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.STATUS_VERSIONS, versions);
  }
}