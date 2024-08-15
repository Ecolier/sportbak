import environmentConfig, { EnvironmentMode } from "./environment.config";

const defaultApiVideoProduction = 'https://api.video.sportbak.com';
const defaultApiVideoDevelopment = 'https://api.dev.video.sportbak.com';
const defaultApiVideoLocal = 'http://localhost:8080';

let apiVideo = defaultApiVideoProduction; // default
if (environmentConfig.mode == EnvironmentMode.development) {
    apiVideo = process.env.DEV_API_VIDEO_URL || defaultApiVideoDevelopment
} else if (environmentConfig.mode == EnvironmentMode.local) {
    apiVideo = process.env.LOCAL_API_VIDEO_URL || defaultApiVideoLocal;
} else {
    apiVideo = process.env.PROD_API_VIDEO_URL || defaultApiVideoDevelopment
}

const externalUrlsConfig = {
    apiVideo : apiVideo,
    staticSportbak : process.env.STATIC_SPORTBAK_URL || 'https://static.sportbak.com',
};

export default externalUrlsConfig;