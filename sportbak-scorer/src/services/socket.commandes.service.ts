import { Socket } from "socket.io-client";
import WebSocket from "ws";
import { SocketCommandesMessageAction } from "../constants/socket.commandes.action.constant";
import ContextService from "./context.service";

export interface SocketCommandesMessage {
    action : SocketCommandesMessageAction;
    params : any;
}

export default class SocketCommandesService {
    
    constructor(){
    }

    private getMessage(action: SocketCommandesMessageAction, params : any = {}) : SocketCommandesMessage {
        const message = {
            action : action,
            params : params || {}
        }
        return message;
    }

    send(socket: WebSocket | Socket, action: SocketCommandesMessageAction, params : any = {}) : boolean {
        const message = this.getMessage(action, params);
        if (socket instanceof WebSocket) {
            socket.send(JSON.stringify(message));
        } else {
            socket.emit('command', message.action, message.params);
        }
        return true;
    }
    
    broadcast(contextService : ContextService, action: SocketCommandesMessageAction, params : any = {}, includeExternalBackend = true) : boolean {
        const message = this.getMessage(action, params);
        contextService.connectionService.broadcast(JSON.stringify(message));
        if (includeExternalBackend) {
            contextService.sportbakService.client.emit('command', message.action, message.params)
        }
        return true;
    }
}