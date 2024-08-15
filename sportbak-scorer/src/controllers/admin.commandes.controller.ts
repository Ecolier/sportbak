import Config from "../models/config.model";
import ContextService from "../services/context.service";



// -------------------------- //
// ------- CONTROLLER ------- //
// -------------------------- //

export async function rebootSystem(contextService: ContextService, socket: any) : Promise<boolean> {
    return await contextService.adminCommandesServices.rebootSystem((message, error) => {
        console.log("Reboot - message : " + message);
        console.log("Reboot - error : " + error);
    });
}

export async function stopSystem(contextService: ContextService, socket: any) : Promise<boolean>{
    return await contextService.adminCommandesServices.stopSystem((message, error) => {
        console.log("Stop - message : " + message);
        console.log("Stop - error : " + error);
    });
}

export function resetApiKeys(contextService: ContextService, socket: any) : Config {
    return contextService.adminCommandesServices.resetApiKeys(contextService);
}