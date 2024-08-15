import Container from "typedi";

import sportbakConfig from "../config/sportbak.config";
import redisConfig from "../config/redis.config";
import videoConfig from "../config/video.config";

export function load(){

    Container.set('sportbak.url', sportbakConfig.url);
    Container.set('sportbak.user', sportbakConfig.user);
    Container.set('sportbak.password', sportbakConfig.password);

    Container.set('redis.url', redisConfig.url);

    Container.set('video.expiration', videoConfig.expiration);
    Container.set('video.mediaBaseUrl', videoConfig.mediaBaseUrl);
    Container.set('video.directories', videoConfig.directories);
        
}
