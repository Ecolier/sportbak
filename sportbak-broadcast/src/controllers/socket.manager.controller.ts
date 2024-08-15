
import { Socket } from "socket.io";
import { SocketCommandesMessageAction } from "../constants/socket.command.constant";
import { SocketContext } from "../services/socket.service";

export function isConnected(context : SocketContext, socket : Socket, fieldId : string) {
    const isConnected = context.socketService.getSocketIdsOfRoomId(context.device, fieldId).length ? true : false
    socket.emit('isConnected', fieldId, isConnected);
}

export function webRTCIsEnabled(context : SocketContext, socket : Socket, fieldId : string, params : any) {
    if (!params) params = {};
        params['platform'] = "managerwebsite";
    const socketData = context.socketDataService.get(socket); 
    if (fieldId && socketData.fromIp) {
        const socketIdsForField = context.socketService.getSocketIdsOfRoomId(context.device, fieldId);
        for (let sId of socketIdsForField) {
            // check if in same network
            if (socketData.fromIp == context.socketDataService.get(sId).fromIp) {
                let currSocket = context.socketService.getDeviceSocketById(sId);
                currSocket.emit('command', SocketCommandesMessageAction.WEBRTC_IS_ENABLED, params);
            }
        }
    }
}
