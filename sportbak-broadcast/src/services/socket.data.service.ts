import { Socket } from "socket.io";
import { Service } from "typedi";
import { isString } from "../utils/utils";


export interface SocketData {
    fromIp : string;
    fieldId : string;
    complexId : string;
    clientIpAddress : string;
    vpnIpAddress : string;
    fieldIds : string[];
}

export type PartialSocketData = Partial<SocketData>;
export type SocketId = string;

@Service()
export default class SocketDataService {
    private _data : {[socketId : string] : PartialSocketData} = {};

    private getSocketId(socket : Socket | SocketId) : SocketId {
        if (isString(socket))
            return (socket as SocketId);
        return (socket as Socket).id;
    }
    
    set(socket : Socket| SocketId, data : PartialSocketData) {
        const id = this.getSocketId(socket);
        if (!this._data[id])
            this._data[id] = {}
        this._data[id] = Object.assign(this._data[id], data);
    }

    get(socket : Socket | SocketId) : PartialSocketData {
        const id = this.getSocketId(socket);
        return this._data[id] ? this._data[id] : {};
    }

    clear(socket : Socket | SocketId) {
        const id = this.getSocketId(socket);
        delete this._data[id];
    }
}