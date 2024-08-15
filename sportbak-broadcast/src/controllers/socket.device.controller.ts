import { Socket } from "socket.io";
import { PartialSocketData } from "../services/socket.data.service";
import { SocketContext } from "../services/socket.service";

export function ipAddress(context : SocketContext, socket : Socket, params : any) {
    const data : PartialSocketData= {
        clientIpAddress : params?.localIPAddresses, 
        vpnIpAddress : params?.vpnIpAddress
    };
    context.socketDataService.set(socket, data);
    const socketData = context.socketDataService.get(socket); 
    context.manager.in(socketData.complexId).emit('message', socketData.fieldId, 'status/ipaddresses', {localIPAddresses : params?.localIPAddresses});
    context.admin.emit('message', socketData.complexId, socketData.fieldId, 'status/ipaddresses', params);
}

export function versions(context : SocketContext, socket : Socket, params : any) {
    const socketData = context.socketDataService.get(socket); 
    context.admin.emit('message', socketData.complexId, socketData.fieldId, 'status/versions', params);
}

export function webRTCTunnel(context : SocketContext, socket : Socket, params : any) {
    const id = params?.id;
    const data = params?.data;
    //console.log("WebRTC tunnel - " + id + " : ", data);
    if (id && data) {
        const socketTarget = context.socketService.getWebRTCSocketById(id);
        if (socketTarget) {
            //console.log("WebRTC tunnel message : ", data);
            socketTarget.emit('message', data);
        }
    }
}

export function webRTCTunnelStop(context : SocketContext, socket : Socket, params : any) {
    const id = params?.id;
    if (id) {
        const socketTarget = context.socketService.getWebRTCSocketById(id);
        if (socketTarget) {
            socketTarget.disconnect();
        }
    }
}
