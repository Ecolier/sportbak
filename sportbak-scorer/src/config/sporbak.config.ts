import { SportbakConfig } from "../models/config.model";
import frontendInterfaceConfig from "./frontend.interface.config";
import confMappingGamePad from "./gamepad.config";
import overlayConfig from "./overlay.config";
import screensaverConfig from "./screensaver.config";

const second = 1;
const minute = 60 * second;
const hour = 60 * minute;

// default config
const config : SportbakConfig = {
    apiKey: "",
    apiSecret: "",
    sendVideoAsSoon: true,
    dailySendHour: "04:00",
    bitrate: 2000,
    height: 576,
    chunkSizeUpload : 1,
    buzzTime: 30 * second,
    varTime : 30 * second,
    deleteVideo: 2,
    mapping : confMappingGamePad,
    launchSessionFromFrontend : true,
    launchSessionFromFrontendWithWarmup : false,
    stopSessionFromFrontend : true,
    pauseSessionFromFrontend : false,
    enableWebRTCFromManagerSpace : true,
    enableWebRTCFromBarApp : true,
    enableWebRTCFromLocalhost : true,
    enableWebRTCFromAllSources : false,
    enableBarApplication : true,
    restrictionSocketTokenBarApp : true,
    restrictionSocketTokenFrontEnd : true,
    restrictionSocketTokenWebRTC : true,
    sendFullVideo : true,
    sendBuzzVideo : true,
    sendGoalVideo : true,
    sendVarVideo : true,
    frontendInterface : frontendInterfaceConfig,
    limitGoals : 99,
    limitBuzzs : 49,
    limitVar : 49,
    limitSessionTime : 3 * hour,
    limitWebRTCManager : 1,
    screensaver : screensaverConfig,
    overlay : overlayConfig
};
export default config ;
