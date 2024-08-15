import { FrontendInterface } from "../config/frontend.interface.config";
import { MappingGamePad } from "../config/gamepad.config";
import { OverlayConfig } from "../config/overlay.config";
import { ScreensaverConfig } from "../config/screensaver.config";
import config from "../config/sporbak.config";
import conf from "../config/sporbak.config";


export interface SportbakConfig {
    // KEYS
    apiKey: string;
    apiSecret: string;
    // VIDEO
    bitrate: number;
    height: number;
    deleteVideo: number;
    // UPLOAD
    sendVideoAsSoon: boolean;
    dailySendHour: string;
    chunkSizeUpload : number; // in Megaoctets (Mo)
    sendFullVideo : boolean;
    sendBuzzVideo : boolean;
    sendGoalVideo : boolean;
    sendVarVideo : boolean;
    // BUTTONS
    mapping : MappingGamePad;
    buzzTime: number;
    varTime : number;
    // SESSION
    launchSessionFromFrontend : boolean;
    launchSessionFromFrontendWithWarmup : boolean;
    pauseSessionFromFrontend : boolean;
    stopSessionFromFrontend : boolean;
    // WEBRTC
    enableWebRTCFromManagerSpace : boolean;
    enableWebRTCFromBarApp: boolean;
    enableWebRTCFromLocalhost: boolean;
    enableWebRTCFromAllSources: boolean;
    enableBarApplication : boolean;
    // TOKEN
    restrictionSocketTokenBarApp : boolean;
    restrictionSocketTokenFrontEnd : boolean;
    restrictionSocketTokenWebRTC : boolean;
    // FRONTEND 
    frontendInterface : FrontendInterface;
    // LIMITS
    limitGoals : number;
    limitBuzzs : number;
    limitVar : number;
    limitSessionTime : number;
    limitWebRTCManager : number;
    // SCREENSAVER
    screensaver : ScreensaverConfig;
    // OVERLAY
    overlay : OverlayConfig;
}

export default class Config implements SportbakConfig {
    apiKey: string;
    apiSecret: string;
    sendVideoAsSoon: boolean;
    dailySendHour: string;
    bitrate: number;
    height: number;
    chunkSizeUpload : number; 
    sendFullVideo : boolean;
    sendBuzzVideo : boolean;
    sendGoalVideo : boolean;
    sendVarVideo : boolean;
    buzzTime: number;
    varTime : number;
    deleteVideo: number;
    mapping : MappingGamePad;
    launchSessionFromFrontend : boolean;
    launchSessionFromFrontendWithWarmup : boolean;
    pauseSessionFromFrontend : boolean;
    stopSessionFromFrontend : boolean;
    enableWebRTCFromManagerSpace : boolean;
    enableWebRTCFromBarApp: boolean;
    enableWebRTCFromLocalhost: boolean;
    enableWebRTCFromAllSources : boolean;
    enableBarApplication : boolean;
    restrictionSocketTokenBarApp : boolean;
    restrictionSocketTokenFrontEnd : boolean;
    restrictionSocketTokenWebRTC : boolean;
    frontendInterface : FrontendInterface;
    limitGoals : number;
    limitBuzzs : number;
    limitVar : number;
    limitSessionTime : number;
    limitWebRTCManager : number;
    screensaver : ScreensaverConfig;
    overlay : OverlayConfig;

    constructor(apiKey, apiSecret, sendVideoAsSoon, dailySendHour, bitrate
        , height, buzzTime, deleteVideo, mapping : MappingGamePad, varTime, launchSessionFromFrontend
        , launchSessionFromFrontendWithWarmup, enableWebRTCFromManagerSpace, enableWebRTCFromBarApp
        , enableWebRTCFromLocalhost, enableWebRTCFromAllSources, chunkSizeUpload, enableBarApplication
        , pauseSessionFromFrontend, restrictionSocketTokenBarApp, restrictionSocketTokenFrontEnd
        , restrictionSocketTokenWebRTC, stopSessionFromFrontend
        , sendFullVideo, sendBuzzVideo, sendGoalVideo, sendVarVideo
        , frontendInterface : FrontendInterface
        , limitGoals, limitBuzzs, limitVar, limitSessionTime, limitWebRTCManager
        , screensaver : ScreensaverConfig
        , overlay : OverlayConfig
        ){
            
        this.apiKey = apiKey !== undefined ? apiKey : conf.apiKey;
        this.apiSecret = apiSecret !== undefined ? apiSecret : conf.apiSecret;
        this.sendVideoAsSoon = sendVideoAsSoon !== undefined ? sendVideoAsSoon : conf.sendVideoAsSoon;
        this.dailySendHour = dailySendHour !== undefined ? dailySendHour : conf.dailySendHour;
        this.bitrate = bitrate !== undefined ? bitrate : conf.bitrate;
        this.height = height !== undefined ? height : conf.height;
        this.buzzTime = buzzTime !== undefined ? buzzTime : conf.buzzTime;
        this.deleteVideo = deleteVideo !== undefined ? deleteVideo : conf.deleteVideo;
        this.mapping = Object.assign({}, conf.mapping, mapping ? mapping : {});
        this.varTime = varTime !== undefined ? varTime : conf.varTime;
        this.launchSessionFromFrontend = launchSessionFromFrontend !== undefined ? launchSessionFromFrontend : conf.launchSessionFromFrontend;
        this.launchSessionFromFrontendWithWarmup = launchSessionFromFrontendWithWarmup !== undefined ? launchSessionFromFrontendWithWarmup : conf.launchSessionFromFrontendWithWarmup;
        this.stopSessionFromFrontend = stopSessionFromFrontend !== undefined ? stopSessionFromFrontend : conf.stopSessionFromFrontend;
        this.enableWebRTCFromManagerSpace = enableWebRTCFromManagerSpace !== undefined ? enableWebRTCFromManagerSpace : conf.enableWebRTCFromManagerSpace;
        this.enableWebRTCFromBarApp = enableWebRTCFromBarApp !== undefined ? enableWebRTCFromBarApp : conf.enableWebRTCFromBarApp;
        this.enableWebRTCFromLocalhost = enableWebRTCFromLocalhost !== undefined ? enableWebRTCFromLocalhost : conf.enableWebRTCFromLocalhost;
        this.enableWebRTCFromAllSources = enableWebRTCFromAllSources !== undefined ? enableWebRTCFromAllSources : conf.enableWebRTCFromAllSources;
        this.chunkSizeUpload = chunkSizeUpload !== undefined ? chunkSizeUpload : conf.chunkSizeUpload
        this.enableBarApplication = enableBarApplication !== undefined ? enableBarApplication : conf.enableBarApplication;
        this.pauseSessionFromFrontend = pauseSessionFromFrontend !== undefined ? pauseSessionFromFrontend : conf.pauseSessionFromFrontend;
        this.restrictionSocketTokenBarApp = restrictionSocketTokenBarApp !== undefined ? restrictionSocketTokenBarApp : conf.restrictionSocketTokenBarApp;
        this.restrictionSocketTokenFrontEnd = restrictionSocketTokenFrontEnd !== undefined ? restrictionSocketTokenFrontEnd : conf.restrictionSocketTokenFrontEnd;
        this.restrictionSocketTokenWebRTC = restrictionSocketTokenWebRTC !== undefined ? restrictionSocketTokenWebRTC : conf.restrictionSocketTokenWebRTC;
        this.sendFullVideo = sendFullVideo !== undefined ? sendFullVideo : config.sendFullVideo;
        this.sendBuzzVideo = sendBuzzVideo !== undefined ? sendBuzzVideo : config.sendBuzzVideo;
        this.sendGoalVideo = sendGoalVideo !== undefined ? sendGoalVideo : config.sendGoalVideo;
        this.sendVarVideo = sendVarVideo !== undefined ? sendVarVideo : config.sendVarVideo;
        this.frontendInterface = Object.assign({}, conf.frontendInterface, frontendInterface ? frontendInterface : {});
        this.limitGoals = limitGoals !== undefined ? limitGoals : config.limitGoals;
        this.limitBuzzs = limitBuzzs !== undefined ? limitBuzzs : config.limitBuzzs;
        this.limitVar = limitVar !== undefined ? limitVar : config.limitVar;
        this.limitSessionTime = limitSessionTime !== undefined ? limitSessionTime : config.limitSessionTime;
        this.limitWebRTCManager = limitWebRTCManager !== undefined ? limitWebRTCManager : config.limitWebRTCManager;
        this.screensaver = Object.assign({}, conf.screensaver, screensaver ? screensaver : {});
        this.overlay = Object.assign({}, conf.overlay, overlay ? overlay : {});
    }
}