import { SocketCommandesMessageAction } from "../constants/socket.commandes.action.constant";
import ContextService from "../services/context.service";
import { isObject } from "../utils/utilities";
import { reloadAllDataSocket } from "./socket.controller";

const privateKeys = ['apiKey', 'apiSecret'];

export function getConfig(contextService: ContextService, socket: any) : boolean {
    let params : any = contextService.configService.read();
    for (let key of privateKeys) {
        if (params[key]) {
            delete params[key];
        }
    }
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.CONFIG_GET, params);
}

export function updateConfig(contextService: ContextService, socket: any, params : any) : boolean {
    if (!params) {
        params = {};
    }

    for (let key of privateKeys) {
        if (params[key]) {
            delete params[key];
        }
    }

    let config = contextService.configService.read();
    for (let key in params) {
        if (isObject(params[key]) && isObject(config[key])) {
            if (params[key]) {
                for (let skey in params[key]) {
                    if (skey in config[key]) {
                        config[key][skey] = params[key][skey];
                    }
                }
            }
        } else if (!isObject(params[key]) && !isObject(config[key])) {
            config[key] = params[key];
        }
        
    }
    config = contextService.configService.save(config);

    for (let key of privateKeys) {
        if (config[key]) {
            delete config[key];
        }
    }
    reloadAllDataSocket(contextService);
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.CONFIG_UPDATE, config);
}
