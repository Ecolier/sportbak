import ConnectionService from "./connection.service";
import FrontendService from "./frontend.service";
import SessionService from "./session.service";
import SportbakClient from "./sportbak.service";
import VideoClient from "./video.service";

import videoConfig from "../config/video.config"
import SocketCommandesService from "./socket.commandes.service";
import ConfigService from "./config.service";
import FileConfig from '../config/file.config'
import AdminCommandesService from "./admin.commandes.service";
import { StatusService } from "./status.service";
import { LogService } from "./log.service";
import * as path from 'path';
import { Service } from "typedi";
import { TokenService } from "./token.service";
import SocketErrorService from "./socket.error.service";
import RedisService from "./redis.service";
import { broadcastCurrentSession } from "../controllers/session.controller";
import SocketDataService from "./socket.data.service";
import WebRTCService from "./webrtc.service";
import { OverlayService } from "./overlay.service";

@Service()
export default class ContextService{
    sessionService : SessionService;
    frontendService : FrontendService;
    sportbakService : SportbakClient;
    videoService : VideoClient;
    connectionService: ConnectionService;
    socketDataService : SocketDataService;
    socketCommandesService : SocketCommandesService;
    configService : ConfigService;
    adminCommandesServices : AdminCommandesService;
    statusService : StatusService;
    logService: LogService;
    tokenService : TokenService;
    socketErrorService : SocketErrorService;
    redisService : RedisService;
    webRTCService : WebRTCService;
    overlayService : OverlayService;

    constructor(){
        this.videoService = new VideoClient();
        this.frontendService = new FrontendService();
        this.socketDataService = new SocketDataService();
        this.connectionService = new ConnectionService();
        this.socketCommandesService = new SocketCommandesService();
        this.configService = new ConfigService(FileConfig.path);
        this.sportbakService = new SportbakClient(this, this.configService.getCurrent());
        this.adminCommandesServices = new AdminCommandesService();
        this.statusService = new StatusService();
        this.logService = new LogService(path.join(process.cwd(), 'logs', 'logs.txt'));
        this.tokenService = new TokenService();
        this.socketErrorService = new SocketErrorService();
        this.redisService = new RedisService();
        this.sessionService = new SessionService(this, this.videoService);
        this.webRTCService = new WebRTCService(this);
        this.overlayService = new OverlayService(this);
        this.init();
    }

    private async init() {
        //this.configService.print(this.configService.getCurrent());
        this.redisService.connect();
        this.tokenService.clearOldTokens();
        await this.sessionService.reload();
        this.videoService.connect(videoConfig.service_url);
        broadcastCurrentSession(this); // broadcast current session after reload session
    }
}