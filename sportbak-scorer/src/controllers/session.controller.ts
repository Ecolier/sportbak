import { SocketCommandesMessageAction } from '../constants/socket.commandes.action.constant';
import { StartSessionInput } from '../models/start.session.input';
import ContextService from '../services/context.service';
import { VarService } from '../services/var.service';

export function start(contextService: ContextService, socket: any, params: StartSessionInput){
    const startSession = contextService.sessionService.getStartSessionConfiguration(contextService.sportbakService, params)
    console.log("startSession : "  + JSON.stringify(startSession, null, 2));
    try {
        contextService.sessionService.createSession(startSession.time, startSession.period, startSession.pauseTime, 
            startSession.teamName1, startSession.teamName2, startSession.sounds, 
            startSession.ambiance, startSession.warmup);
        broadcastCurrentSession(contextService);
        
        contextService.sessionService.onStop = () => {
            broadcastCurrentSession(contextService);
        };
    }catch (e) {
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.SESSION_ERROR, {'message': e.message});
    }
   
}

export function pause(contextService: ContextService, socket: any, params){
    contextService.sessionService.pause();
    broadcastCurrentSession(contextService);
}

export function restart(contextService: ContextService, socket: any, params){
    contextService.sessionService.restart();
    broadcastCurrentSession(contextService);
}

export function reset(contextService: ContextService, socket: any, params){
    contextService.sessionService.reset();
    broadcastCurrentSession(contextService);
}

export function stop(contextService: ContextService, socket: any, params){
    try{ 
        contextService.sessionService.stop();
        broadcastCurrentSession(contextService);
    }catch(e){
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.SESSION_ERROR, {'message': e.message});
    }
}


export function score(contextService: ContextService, socket: any, params){
    contextService.sessionService.setScore(params.scoreTeam1, params.scoreTeam2);
    broadcastCurrentSession(contextService);
}

export function addGoalTeam1(contextService: ContextService, socket: any, params){
    const config = contextService.configService.read();
    if (!contextService.sessionService.canAddGoalTeam1(config.limitGoals)) {
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.LIMIT_REACHED_GOALS, {team : 1, limit : config.limitGoals});
        return;
    }
    const goalOk = contextService.sessionService.addGoalTeam1();
    broadcastCurrentSession(contextService);
    if (goalOk){
        broadcastGoal(contextService);
    }
}

export function addGoalTeam2(contextService: ContextService, socket: any, params){
    const config = contextService.configService.read();
    if (!contextService.sessionService.canAddGoalTeam2(config.limitGoals)) {
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.LIMIT_REACHED_GOALS, {team : 2, limit : config.limitGoals});
        return;
    }
    const goalOk = contextService.sessionService.addGoalTeam2();
    broadcastCurrentSession(contextService);
    if (goalOk){
        broadcastGoal(contextService);
    }

}

export function undo(contextService: ContextService, socket: any, params){
    contextService.sessionService.undo();
    broadcastCurrentSession(contextService);
}

export function buzz(contextService: ContextService, socket: any, params){
    const config = contextService.configService.read();
    if (!contextService.sessionService.canExecuteBuzz(config.limitBuzzs)) {
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.LIMIT_REACHED_BUZZS, {limit : config.limitBuzzs});
        return;
    }
    if (contextService.sessionService.hasCurrentSession()) {
        contextService.sessionService.buzz();
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.SESSION_BUZZ);
        broadcastCurrentSession(contextService);
    }
}

export function runVar(contextService: ContextService, socket: any, params){
    const config = contextService.configService.read();
    if (!contextService.sessionService.canExecuteVar(config.limitVar)) {
        contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.LIMIT_REACHED_VARS, {limit : config.limitVar});
        return;
    }
    let currentSession = contextService.sessionService.getCurrentSession();
    if (currentSession && currentSession.videoSessionId) {
        let data = VarService.createPlaylist(contextService, currentSession.videoSessionId);
        console.log("Var - Playlist created : ", data);
        if (data) {
            contextService.sessionService.var();
            contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.SESSION_VAR, data);
            broadcastCurrentSession(contextService);
        } 
    }
}

export function teamNames(contextService: ContextService, socket: any, params){
    contextService.sessionService.setTeamName(params.teamName1, params.teamName2);
    broadcastCurrentSession(contextService);
}

export function getCurrentSession(contextService: ContextService, socket: any, params){
    let currentSession : any = contextService.sessionService.getCurrentSession();
    console.log("Send current session ...");
    contextService.socketCommandesService.send(socket, SocketCommandesMessageAction.SESSION_CURRENT_SESSION, currentSession);
}

export function broadcastGoal(contextService: ContextService){
    contextService.socketCommandesService.broadcast(contextService, SocketCommandesMessageAction.SESSION_GOAL);
}

export function broadcastCurrentSession(contextService: ContextService){
    let currentSession : any = contextService.sessionService.getCurrentSession();        
    contextService.socketCommandesService.broadcast(contextService, SocketCommandesMessageAction.SESSION_CURRENT_SESSION, currentSession);
}