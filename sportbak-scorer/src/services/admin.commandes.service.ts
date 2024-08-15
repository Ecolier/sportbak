import { SocketCommandesMessageAction } from "../constants/socket.commandes.action.constant";
import { broadcastCurrentSession } from "../controllers/session.controller";
import ContextService from "./context.service";

var exec = require('child_process').exec;

export type AdminCommandesCallback = (message : string, error : string) => void;

async function execute(command, callback : AdminCommandesCallback) : Promise<boolean> {
    let success = false;
    let result = await new Promise<{error: string, stdout: string, stderr: string}>((resolve) => {
        exec(command, function(error, stdout, stderr){ 
            resolve({
                error : error,
                stdout : stdout,
                stderr : stderr
            })
        });
    }) 
    if (!result.error) {
        success = true;
    }

    console.log("Result  : " + JSON.stringify(result));
    if (callback) {
        callback(result.stdout, result.stderr);
    }
    return success;
}


export default class AdminCommandesService {
    
    constructor(){
    }

    public rebootSystem(callback : AdminCommandesCallback = null) : Promise<boolean> {
        console.log("Reboot system ...");
        return execute("echo 1 > /proc/sys/kernel/sysrq && echo r > /proc/sysrq-trigger && echo s > /proc/sysrq-trigger && sleep 2 && echo u > /proc/sysrq-trigger && echo b > /proc/sysrq-trigger", callback);
    }

    public stopSystem(callback : AdminCommandesCallback = null) : Promise<boolean> {
        console.log("Stop system ...");
        return execute("echo 1 > /proc/sys/kernel/sysrq && echo r > /proc/sysrq-trigger && echo s > /proc/sysrq-trigger && sleep 2 && echo u > /proc/sysrq-trigger && echo o > /proc/sysrq-trigger", callback);
    }

    public resetApiKeys(contextService : ContextService, reloadSportbakService= true) {
        console.log("ResetApiKeys ...")
        const config = contextService.configService.resetApiKeys();
        if (contextService.sessionService.hasCurrentSession())
            contextService.sessionService.stop();
        broadcastCurrentSession(contextService);
        if (reloadSportbakService) {
            contextService.sportbakService.reload(contextService, config);
        }
        contextService.socketCommandesService.broadcast(contextService, SocketCommandesMessageAction.ONBOARDING_NEEDED);
        return config;
    }
}