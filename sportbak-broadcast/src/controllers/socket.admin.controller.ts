import { Socket } from "socket.io";
import { SocketContext } from "../services/socket.service";

export function isConnected(context : SocketContext, socket : Socket, fieldId : string) {
    const isConnected = context.socketService.getSocketIdsOfRoomId(context.device, fieldId).length ? true : false
    socket.emit('isConnected', fieldId, isConnected);
}