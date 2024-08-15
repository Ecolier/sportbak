import externalUrlsConfig from "../config/externalUrls.config";
import { SocketCommandesMessageAction } from "../constants/socket.commandes.action.constant";
import ContextService from "../services/context.service";
import { SocketCommandesMessage } from "../services/socket.commandes.service";


// -------------------------- //
// ---------- MESSAGE ------- //
// -------------------------- //

function getParamsInit(contextService: ContextService) : any {
    const conf = contextService.configService.read();
    const params = {
        mapping : conf.mapping,
        launchSessionFromFrontend : conf.launchSessionFromFrontend,
        launchSessionFromFrontendWithWarmup : conf.launchSessionFromFrontendWithWarmup,
        pauseSessionFromFrontend : conf.pauseSessionFromFrontend,
        stopSessionFromFrontend : conf.stopSessionFromFrontend,
        frontendInterface : conf.frontendInterface,
        screensaver : conf.screensaver
    };
    return params;
}

function getParamsField(contextService: ContextService) : any {
    if (!contextService.sportbakService.field) return null;
    const params = contextService.sportbakService.field;
    return params;
}

function getParamsComplex(contextService: ContextService) : any {
    if (!contextService.sportbakService.field) return null;
    const params = contextService.sportbakService.complex;
    return params;
}

function getParamsComplexUrlLogo(contextService: ContextService) : any {
    const conf = contextService.configService.getCurrent();
    let params = {
        url : null
    };
    if (contextService.sportbakService.complex && contextService.sportbakService.complex.logo) {
        params.url = externalUrlsConfig.staticSportbak + "/images/complexes/logos/" + contextService.sportbakService.complex.logo ;
    } 
    return params;
}

function getParamsLogged(contextService: ContextService) : any  {
    if (!contextService.sportbakService.field || !contextService.sportbakService.complex) return null;
    const params = {
        complex : contextService.sportbakService.complex,
        field : contextService.sportbakService.field
    };
    return params;
}


// -------------------------- //
// ------- CONTROLLER ------- //
// -------------------------- //

// init
export function sendInit(contextService: ContextService, socket: any) : boolean {
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.DATA_INIT, getParamsInit(contextService));
}

// field
export function sendField(contextService: ContextService, socket: any) : boolean {
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.DATA_FIELD, getParamsField(contextService));
}

// complex
export function sendComplex(contextService: ContextService, socket: any) : boolean {
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.DATA_COMPLEX, getParamsComplex(contextService));
}

export function sendComplexUrlLogo(contextService: ContextService, socket: any) : boolean {
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.DATA_COMPLEX_URL_LOGO, getParamsComplexUrlLogo(contextService));
}

// logged
export function sendLogged(contextService: ContextService, socket: any) : boolean {
    return contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.DATA_LOGGED, getParamsLogged(contextService));
}
export function broadcastLogged(contextService: ContextService) : boolean {
    return contextService.socketCommandesService.broadcast(contextService, SocketCommandesMessageAction.DATA_LOGGED, getParamsLogged(contextService), false);
}