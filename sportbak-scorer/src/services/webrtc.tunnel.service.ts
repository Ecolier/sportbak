import ReconnectingWebSocket from "reconnecting-websocket";
import { Socket } from "socket.io-client";
import ws from 'ws';

const options = {
    WebSocket: ws, // custom WebSocket constructor
    connectionTimeout: 1000
};

export type WebRTCTunnelOnMessage = (message : string) => {action : string, params : any};
export type WebRTCTunnelOnSend = (action : string, params : any) => string;
export type WebRTCTunnelOnSendReady = () => string;


export default class WebRTCTunnelService {
    private static sockets : WebRTCTunnelService[] = [];

    private socketSrc : ws | Socket;
    private videoServiceUrl : string;
    private videoSocket : ReconnectingWebSocket = null;
    private disconnectSrcAtTheEnd : boolean = false;

    public id : string = null;
    public tag : string = null;

    public onConnect : () => void = null;
    public onDisconnect : () => void = null;

    public onmessage : WebRTCTunnelOnMessage;
    public onsend : WebRTCTunnelOnSend;
    public onsendready : WebRTCTunnelOnSendReady;

    private running = false;

    constructor(socketSrc : ws | Socket, 
        videoServiceUrl: string, 
        disconnectSrcAtTheEnd : boolean = false) {
        this.videoServiceUrl = videoServiceUrl;
        this.socketSrc = socketSrc;
        this.disconnectSrcAtTheEnd = disconnectSrcAtTheEnd;
        this.onmessage = (message) => {
            let data = this.getDataFromMessage(message);
            return data;
        }

        this.onsend = (action, params) => {
            return JSON.stringify({action : action, params : params});
        }

        this.onsendready = () => {
            return JSON.stringify({action : "ready", params : {}});
        }

        this.start();
    }

    private async start() {
        this.running = true;

        this.videoSocket = new ReconnectingWebSocket(this.videoServiceUrl + '/webrtc', [], options);
        //console.log("Socket : ", videoSocket);
        this.videoSocket.onopen = (event: any)  => {
            console.log("Video service - WebRTC Socket connected ...");
            if (this.onsendready) {
                const message = this.onsendready();
                if (message) {
                    this.send(this.socketSrc, message);
                }
            }
        };
        this.videoSocket.onmessage = (message) => {
            //console.log("Video service - WebRTC Socket ..." + message);
            let data = this.getDataFromMessage(message?.data?.toString());
            if (data) {
                //console.log("Video service - WebRTC Socket - data :", data);
                if (this.onsend) {
                    const message = this.onsend(data.action, data.params);
                    if (message) {
                        this.send(this.socketSrc, message);
                    }
                }
            }
        }

        if (this.socketSrc instanceof ws) {
            this.socketSrc.onmessage = (message) => {
                //console.log("WebRTC Socket - onmessage : " + message);
                if (this.onmessage) {
                    let data = this.onmessage(message.data.toString());
                    if (data) {
                        const message = JSON.stringify(data);
                        this.sendVideoSocket(message);
                    }
                }
            }
        } else {
            this.socketSrc.on('command', (action, params) => {
                //console.log("WebRTC Socket - onmessage :" + JSON.stringify(action, params));
                if (this.onmessage) {
                    let data = this.onmessage(JSON.stringify(action, params));
                    if (data) {
                        const message = JSON.stringify(data);
                        this.sendVideoSocket(message);
                    }
                }
            });
        }


        this.videoSocket.onclose = (event : CloseEvent) => {
            this.running = false;
            if (this.onDisconnect)
                this.onDisconnect();
            if (this.disconnectSrcAtTheEnd) {
                this.socketSrc.close();
            }
        }

        this.socketSrc.on('close', () => {
            this.videoSocket?.close();
        })
    }

    sendVideoSocket(message: string) {
        this.send(this.videoSocket, message);
    }

    isRunning() {
        return this.running;
    }

    close() {
        this.videoSocket?.close();
    }



    // ------------------------ //
    // ------- MESSAGE ----------- //
    // ------------------------ //

    private getDataFromMessage(message : string) {
        let data = null;
        try {
            data = JSON.parse(message);
        } catch(err) {
            data = null;
        };
        return data;
    }

    private send(socket : ws | ReconnectingWebSocket | Socket, message : string) {
        socket.send(message);
    }

    // ------------------------ //
    // ------- STATIC ----------- //
    // ------------------------ //

    static storeWebRTCTunnel(webRTCTunnel : WebRTCTunnelService) : boolean {
        let success = false;
        if (webRTCTunnel && !WebRTCTunnelService.sockets.find((s) => s == webRTCTunnel)) {
            WebRTCTunnelService.sockets.push(webRTCTunnel); 
            success = true;
        }
        return success;
    }

    static getWebRTCTunnelById(id : string) : WebRTCTunnelService{
        return WebRTCTunnelService.sockets.find((s) => s.id == id);
    }

    static unstoreWebRTCTunnel(webRTCTunnel : WebRTCTunnelService) : void {
        WebRTCTunnelService.sockets = WebRTCTunnelService.sockets.filter((s) => s != webRTCTunnel);
    }

    static unstoreWebRTCTunnelById(id : string) : void {
        WebRTCTunnelService.sockets = WebRTCTunnelService.sockets.filter((s) => s.id != id);
    }

    static getRunningWebRTCTunnelCount() : number {
        return WebRTCTunnelService.sockets.filter((s) => s.running).length;
    }

    static getRunningWebRTCTunnelWithTagCount(tag : string) : number {
        return WebRTCTunnelService.sockets.filter((s) => s.running && s.tag == tag).length;
    }
}