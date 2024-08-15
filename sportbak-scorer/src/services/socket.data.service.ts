import { Socket } from "socket.io-client";
import WebSocket from "ws";

type MultipleSocket = WebSocket | Socket;

export default class SocketDataService{
    id : number;
    sockets : Array<MultipleSocket>;
    ids : {[id : string] : MultipleSocket}; // id of socket
    data : {[id : string] : any}; // data associated to socket

    constructor(){
        this.id = 0;
        this.sockets = [];
        this.ids = {};
        this.data = {};
    }

    // ------------------------ //
    // ------- UTILITIE ----------- //
    // ------------------------ //

    private getIdOfSocket(socket : MultipleSocket) {
        return Object.keys(this.ids).find(key => this.ids[key] === socket);
    }

    // ------------------------ //
    // ------- CONNECTION ----------- //
    // ------------------------ //

    add(socket: MultipleSocket){
        const id = this.id++;
        this.ids[id] = socket;
        this.data[id] = {};
        this.sockets.push(socket);
    }

    remove(socket: MultipleSocket){
        let id = this.getIdOfSocket(socket);
        if (id) {
            delete this.ids[id];
            delete this.data[id];
        }
        let index = this.sockets.indexOf(socket);
        if (index > -1) {
            this.sockets.splice(index, 1);
        }
    }

    // ------------------------ //
    // ------- DATA ----------- //
    // ------------------------ //

    set(socket: MultipleSocket, key : string, data : any) : boolean {
        let result = false;
        let id = this.getIdOfSocket(socket);
        if (id) {
            this.data[id][key] = data;
            result = true;
        }
        return result;
    }

    get(socket: MultipleSocket, key : string) : any {
        let result = null;
        let id = this.getIdOfSocket(socket);
        if (id) {
            result = this.data[id][key];
        }
        return result;
    }
}