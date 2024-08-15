import ContextService from '../services/context.service';
import configFile from '../config/file.config';
import ConfigService from "../services/config.service";
import { SocketCommandesMessageAction } from '../constants/socket.commandes.action.constant';
import { broadcastCurrentSession } from './session.controller';

export function onboardingNeeded(contextService: ContextService, socket: any){
    contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.ONBOARDING_NEEDED);
}

export async function login(contextService: ContextService, socket: any, params): Promise<string>{
    let token = null;
    try {
        const data = await contextService.sportbakService.login(params.username, params.password);
        token = data.token;
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.ONBOARDING_FIELDS, data);
    }catch (e) {
        console.log("Error  : " + JSON.stringify(e))
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.ONBOARDING_ERROR, {'message': e.message});
    }
   return token;
}

export async function selectField(contextService: ContextService, socket: any, params){
    try {
        if (params.complexId && params.complexId !== "" &&  params.fieldId && params.fieldId !== ""){
            const token = contextService.socketDataService.get(socket, 'external/token');
            const video = await contextService.sportbakService.selectField(token, params.complexId, params.fieldId);
            const configService = contextService.configService;    
            const config = configService.read();
            config.apiKey = video._id;
            config.apiSecret = video.key;
            configService.save(config);
            // reload socket with good api keys
            await contextService.sportbakService.reload(contextService, config);
            contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.ONBOARDING_SUCCESS);
            broadcastCurrentSession(contextService);
        }
    } catch (e) {
        console.log(e);
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.ONBOARDING_ERROR, {'message': e.message});
    }
   
}