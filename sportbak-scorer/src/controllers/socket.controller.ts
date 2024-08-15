import ContextService from '../services/context.service';
import * as sessionController from './session.controller';
import * as dataController from './data.controller';
import * as adminCommandesController from './admin.commandes.controller';
import * as onboardingController from './onboarding.controller';
import * as videoController from "./video.controller";
import * as configController from "./config.controller";
import { SocketCommandesMessageAction } from "../constants/socket.commandes.action.constant";
import { StatusController } from "./status.controller";
import { Socket } from "socket.io-client";
import WebSocket from "ws";
import WebRTCTunnelService from '../services/webrtc.tunnel.service';
import videoConfig from '../config/video.config';



export function reloadDataSocket(context: ContextService, socket: any) {
  const statusController = new StatusController(context);
  const config = context.configService.read();
  if (config.apiKey === "" || config.apiSecret === "") {
    onboardingController.onboardingNeeded(context, socket);
  } else {
    sessionController.getCurrentSession(context, socket, null);
  }

  dataController.sendInit(context, socket);
  dataController.sendLogged(context, socket);
  statusController.sendStatus(socket);
}

export function reloadAllDataSocket(context: ContextService) {
  const sockets = context.connectionService.sockets;
  for (let s of sockets) {
    reloadDataSocket(context, s);
  }
}

export function onConnect(context: ContextService, socket: any) {
  reloadDataSocket(context, socket);
}


export async function onMessage(context: ContextService, socket: WebSocket | Socket, message: string) {
  const statusController = new StatusController(context);
  const socketCmdServ = context.socketCommandesService;
  try {
    let messageObj = JSON.parse(message);
    //console.log("Message received : ", message);
    if ('action' in messageObj && 'params' in messageObj) {
      const action = messageObj['action'];
      const params = messageObj['params'];
      switch (action) {
        case SocketCommandesMessageAction.ONBOARDING_LOGIN:
          let token = await onboardingController.login(context, socket, params);
          if (token) {
            if (socket instanceof WebSocket)
              context.socketDataService.set(socket, 'external/token', token);
          }
          break;
        case SocketCommandesMessageAction.ONBOARDING_SELECT_FIELD:
            onboardingController.selectField(context, socket, params);
            break;
        case SocketCommandesMessageAction.SESSION_START:
          sessionController.start(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_RESET:
          sessionController.reset(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_STOP:
          sessionController.stop(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_TEAM_NAMES:
          sessionController.teamNames(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_ADD_GOAL_TEAM_1:
          sessionController.addGoalTeam1(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_ADD_GOAL_TEAM_2:
          sessionController.addGoalTeam2(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_UNDO:
          sessionController.undo(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_BUZZ:
          sessionController.buzz(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_SCORE:
          sessionController.score(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_PAUSE:
          sessionController.pause(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_RESTART:
          sessionController.restart(context, socket, params);
          break;
        case 'session/currentSession': // TODO - to remove
        case SocketCommandesMessageAction.SESSION_CURRENT_SESSION:
          sessionController.getCurrentSession(context, socket, params);
          break;
        case SocketCommandesMessageAction.SESSION_VAR:
          sessionController.runVar(context, socket, params);
          break;
        case SocketCommandesMessageAction.ADMIN_REBOOT:
          adminCommandesController.rebootSystem(context, socket);
          break;
        case SocketCommandesMessageAction.ADMIN_STOP:
          adminCommandesController.stopSystem(context, socket);
          break;
        case SocketCommandesMessageAction.ADMIN_RESET_API_KEYS:
          adminCommandesController.resetApiKeys(context, socket);
          break;
        case SocketCommandesMessageAction.DATA_COMPLEX:
          dataController.sendComplex(context, socket);
          break;
        case SocketCommandesMessageAction.DATA_COMPLEX_URL_LOGO:
          dataController.sendComplexUrlLogo(context, socket);
          break;
        case SocketCommandesMessageAction.DATA_FIELD:
          dataController.sendField(context, socket);
          break;
        case SocketCommandesMessageAction.STATUS:
          statusController.sendStatus(socket);
          break;
        case SocketCommandesMessageAction.STATUS_IP_ADDRESSES:
          statusController.sendIpAddesses(socket);
          break;
        case SocketCommandesMessageAction.LOG:
          context.logService.write(params);
          break;
        case SocketCommandesMessageAction.VIDEO_GET:
          videoController.broadcastvideos(context, params);
          break;
        case SocketCommandesMessageAction.CONFIG_GET:
          configController.getConfig(context, socket);
          break;
        case SocketCommandesMessageAction.CONFIG_UPDATE:
          configController.updateConfig(context, socket, params);
          break;
        case SocketCommandesMessageAction.STATUS_VERSIONS:
          statusController.sendVersions(socket);
          break;
        case SocketCommandesMessageAction.WEBRTC_IS_ENABLED: {
          const platform = params?.platform;
          let result = {success : false, error : null};
          if (platform == 'managerwebsite') {
            result = await context.webRTCService.webRTCIsEnabledForManagerWebsite(null, false);
          } else if (platform == 'barapp') {
            result = await context.webRTCService.webRTCIsEnabledForBarApp(null, false);
          } else if (platform == 'scorerfrontend') {
            result = context.webRTCService.webRTCIsEnabledForScorerFrontend(false);
          }
          socketCmdServ.send(socket, SocketCommandesMessageAction.WEBRTC_IS_ENABLED, { result: result.success});
          break;
        }
        case SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_START: {
          const config = context.configService.read();
          const id = params?.id;
          const platform = params?.platform;
          let result = {success : false, error : null};
          if (platform == 'managerwebsite') {
            result = await context.webRTCService.webRTCIsEnabledForManagerWebsite(null, false);
          } else if (platform == 'barapp') {
            result = await context.webRTCService.webRTCIsEnabledForBarApp(null, false);
          } else if (platform == 'scorerfrontend') {
            result = context.webRTCService.webRTCIsEnabledForScorerFrontend(false);
          }

          if (!result.success) {
            socketCmdServ.send(socket, SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_STOP, {id : id});
            break;
          } 

          if (WebRTCTunnelService.getRunningWebRTCTunnelWithTagCount(platform) >= config.limitWebRTCManager) {
            const data = {
              action : "error",
              code : -1,
              message : "WebRTC limit reached",
              limit : config.limitWebRTCManager
            }
            socketCmdServ.send(socket, SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL, {id : id, data : data});
            break;
          }

          if (id) {
            const webRTCTunnel = new WebRTCTunnelService(socket, videoConfig.service_url, false);
            webRTCTunnel.onmessage = null; // custom onmessage see SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL
            webRTCTunnel.onsend = (action : string, params : string) => {
              socketCmdServ.send(socket, SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL, {
                id : id,
                data : {
                  action : action,
                  params : params
                }
              });
              return null; // custom send here
            };
            webRTCTunnel.onsendready = () => {
              console.log("Send Ready");
              socketCmdServ.send(socket, SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL, {
                id : id,
                data : {
                  action : 'ready',
                  params : {}
                }
              });
              return null; // custom send here
            }
            webRTCTunnel.id = id;
            webRTCTunnel.tag = platform;
            WebRTCTunnelService.storeWebRTCTunnel(webRTCTunnel);
          }
          // store webtunnel
          break;
        }
        case SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_STOP: {
          // get webTunnel by id
          const id = params?.id;
          if (id) {
            const webRTCTunnel = WebRTCTunnelService.getWebRTCTunnelById(id);
            if (webRTCTunnel) {
              webRTCTunnel.close();
              WebRTCTunnelService.unstoreWebRTCTunnel(webRTCTunnel);
            }
          }
          break;
        }
        case SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL: {
          // get webTunnel by id
          const id = params?.id;
          const data = params?.data;
          if (id && data) {
            const webRTCTunnel = WebRTCTunnelService.getWebRTCTunnelById(id);
            if (webRTCTunnel) {
              webRTCTunnel.sendVideoSocket(data);
            }
          }
          break;
        }
        case SocketCommandesMessageAction.SOCKET_RELOAD_DATA_ALL:
          reloadAllDataSocket(context);
          break;
        case SocketCommandesMessageAction.SOCKET_RELOAD_DATA:
          reloadDataSocket(context, socket);
          break;
        default:
          socketCmdServ.send(socket, SocketCommandesMessageAction.ACTION_NOT_FOUND, { 'message': 'Action not exist - ' + action });
          break;
      }
    } else {
      socketCmdServ.send(socket, SocketCommandesMessageAction.ACTION_ERROR, { 'message': 'wrong message format' });
    }
  } catch (e) {
    //throw e;
    socketCmdServ.send(socket, SocketCommandesMessageAction.ACTION_ERROR, { 'message': e.message });
  }
}

export function onDisconnect(context: ContextService, socket: any) {

}