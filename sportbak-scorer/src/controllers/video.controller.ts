
import { Request, Response } from 'express';
import { SocketCommandesMessageAction } from '../constants/socket.commandes.action.constant';
import ContextService from '../services/context.service';
import { VideoTypesRequested } from '../services/video.service';

export async function newVideoIsReady(req : Request, res: Response){
    const context = req.context;
    if (context) {
        broadcastNewVideoIsReady(context);
    }
}

export function broadcastNewVideoIsReady(contextService: ContextService) : boolean {
    return contextService.socketCommandesService.broadcast(contextService, SocketCommandesMessageAction.VIDEO_NEW, {}, false);
}

export async function broadcastvideos(contextService: ContextService, params : any) : Promise<boolean> {
    let type : VideoTypesRequested = 'ALL'; // default
    let from = null; // default
    let to = null; // default
    if (params) {
        if (params.type) type = params.type;
        if (params.from) from = params.from;
        if (params.to) to = params.to;
    }
    const result = await contextService.videoService.getVideos(contextService, type, from, to);
    return contextService.socketCommandesService.broadcast(contextService, SocketCommandesMessageAction.VIDEO_GET, {
        data : result
    }, false);

}