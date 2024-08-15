import { Socket } from "socket.io-client";
import WebSocket from "ws";

type MultipleSocket = WebSocket | Socket;

export default class ConnectionService{
    sockets : Array<MultipleSocket>;

    constructor(){
        this.sockets = [];
    }


    // ------------------------ //
    // ------- CONNECTION ----------- //
    // ------------------------ //

    connect(socket: MultipleSocket){
        this.sockets.push(socket);
    }

    disconnect(socket: MultipleSocket){
        let index = this.sockets.indexOf(socket);
        if (index > -1) {
            this.sockets.splice(index, 1);
        }
    }

    // ------------------------ //
    // ------- SEND ----------- //
    // ------------------------ //

    send(socket: MultipleSocket, message : string) {
        socket.send(message);
    }

    broadcast(message: string){
        for (let i=0; i<this.sockets.length; i++){
            this.send(this.sockets[i], message);
        }
    }

}