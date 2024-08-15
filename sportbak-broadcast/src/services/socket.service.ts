import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Container from "typedi";
import SportbakService from './sportbak.service';
import SocketErrorService, { SocketEmitError } from './socket.error.service';
import SocketDataService, { PartialSocketData } from './socket.data.service';
import { login as loginField } from '../models/field.model';
import * as SocketDeviceController from '../controllers/socket.device.controller';
import * as SocketManagerController from '../controllers/socket.manager.controller';
import * as SocketAdminController from '../controllers/socket.admin.controller';
import { SocketCommandesMessageAction } from "../constants/socket.command.constant";

type SocketServer = Namespace<DefaultEventsMap, DefaultEventsMap>;
type DatasetInit = {
    type : string,
    sockets : Socket[],
    socketServer : SocketServer,
    methods : {
        initConnection : (socket:Socket) => Promise<boolean>,
        connected : (socket:Socket) => Promise<boolean>,
        disconnected : (socket:Socket) => Promise<void>,
        dispatchMessage : (socket:Socket) => Promise<void>,
    }
}

export type SocketContext = {
    socketService : SocketService,
    sportbakService : SportbakService, 
    socketErrorService : SocketErrorService,
    socketDataService : SocketDataService,
    device : SocketServer,
    manager : SocketServer,
    admin : SocketServer,
    webrtc : SocketServer
}


export default class SocketService {
    private sportbakService : SportbakService;
    private socketErrorService : SocketErrorService;
    private socketDataService : SocketDataService;
    private context : SocketContext;

    private deviceSockets : Socket[] = [];
    private managerSockets : Socket[] = [];
    private adminSockets : Socket[] = [];
    private webrtcSockets : Socket[] = [];

    private listening : boolean = false;

    constructor(
        private device : SocketServer,
        private manager : SocketServer,
        private admin : SocketServer,
        private webrtc : SocketServer,
        ){

        this.sportbakService = Container.get(SportbakService);
        this.socketErrorService = Container.get(SocketErrorService);
        this.socketDataService = Container.get(SocketDataService);

        this.context = {
            socketService : this,
            sportbakService : this.sportbakService,
            socketErrorService : this.socketErrorService,
            socketDataService : this.socketDataService,
            device : this.device,
            manager : this.manager,
            admin : this.admin,
            webrtc : this.webrtc
        }

        this.listening = false;
    }

    public listen() {
        if (this.listening) return;
        this.listening = true;
        
        const dataSet : DatasetInit[] = [
            {
                type : "device",
                sockets : this.deviceSockets,
                socketServer : this.device,
                methods : {
                    initConnection : this.deviceInitConnection,
                    connected : this.deviceConnected,
                    disconnected : this.deviceDisonnected,
                    dispatchMessage : this.deviceDispatchMessage
                }
            },
            {
                type : "manager",
                sockets : this.managerSockets,
                socketServer : this.manager,
                methods : {
                    initConnection : this.managerInitConnection,
                    connected : this.managerConnected,
                    disconnected : this.managerDisonnected,
                    dispatchMessage : this.managerDispatchMessage
                }
            },
            {
                type : "admin",
                sockets : this.adminSockets,
                socketServer : this.admin,
                methods : {
                    initConnection : this.adminInitConnection,
                    connected : this.adminConnected,
                    disconnected : this.adminDisonnected,
                    dispatchMessage : this.adminDispatchMessage
                }
            },
            {
                type : "webrtc",
                sockets : this.webrtcSockets,
                socketServer : this.webrtc,
                methods : {
                    initConnection : this.webRTCInitConnection,
                    connected : this.webRTCConnected,
                    disconnected : this.webRTCDisonnected,
                    dispatchMessage : this.webRTCDispatchMessage
                }
            },
        ]
        
        const self = this;
        for (let d of dataSet) {
            d.socketServer.use(async function (socket : Socket, next) {
                var clientIp = (socket.handshake.headers["x-real-ip"] as string) || socket.handshake.address; //socket.request.connection.remoteAddress;
                self.socketDataService.set(socket, {fromIp : clientIp});
                self.logSocketStatus(d.type, "Connecting - clientIp : " + clientIp + " ...");
                const success = await d.methods.initConnection.bind(self)(socket);
                self.logSocketStatus(d.type, "Connecting ... Error : " + socket.data.error);
                if (!success && !socket.data.error)
                    socket.data.error = SocketEmitError.UNKNOW;
                if (success)
                    d.methods.dispatchMessage.bind(self)(socket);
                next();
            });

            d.socketServer.on('connect', async function (socket : Socket) {
                let success = true;
                if (socket.data.error) {  // Error during init connection
                    success = false;
                } else {
                    success = await d.methods.connected.bind(self)(socket);
                }
                if (!success) {
                    self.logSocketStatus(d.type, "Connection error : " + socket.data.error);
                    self.socketErrorService.emitError(socket, socket.data.error);
                    return;
                }

                self.logSocketStatus(d.type, "Connected : " + socket.id);
                d.sockets.push(socket);
                socket.on('disconnect', async function() {
                    let index = d.sockets.findIndex((s) => s.id == socket.id);
                    while (index >= 0) {
                        d.sockets.splice(index, 1);
                        index = d.sockets.findIndex((s) => s.id == socket.id);
                    }
                    await d.methods.disconnected.bind(self)(socket);
                    self.socketDataService.clear(socket);
                    self.logSocketStatus(d.type, "Disconnected : " + socket.id);
                })

            })
        }
    }

    // --------------------------------------------------------- //
    // --------------------------------------------------------- //
    // --------------------       DEVICE        --------------- //
    // --------------------------------------------------------- //
    // --------------------------------------------------------- //

    private async deviceInitConnection(socket: Socket) : Promise<boolean> {
        const query = socket.handshake.query;
        let success = false;
        let socketError : SocketEmitError = SocketEmitError.NO_ERROR;
        if (query && query.key && query.secret){
          const field = await loginField(query.key as string, query.secret as string);
          if (field !== null){
            socket.data.field = field;
            try {
              let data = await this.sportbakService.getInitialDataSocket(field.fieldId);
              if (data) {
                let socketData : PartialSocketData = {
                  fieldId : String(data.field._id),
                  complexId : String(data.complex._id)
                }
                this.socketDataService.set(socket, socketData);
                socket.data = data;
                success = true;
              }
            } catch(err) {
                socketError = SocketEmitError.AUTH_FAILED_LOAD_DATA_FROM_FIELDID;
            }
          }
        }
      
        if (!success && !socketError)
            socketError = SocketEmitError.AUTH_WRONG_KEY_SECRECT;
        socket.data.error = socketError;
        return success;
    }

    private async deviceConnected(socket: Socket) : Promise<boolean> {
        socket.emit('init', socket.data);
        socket.emit('command', 'status/ipaddresses');
        socket.emit('command', 'status/versions');
        socket.emit('command', 'session/current-session');

        let socketData = this.socketDataService.get(socket);
        if (socketData.complexId && socketData.fieldId) {
            this.logSocketStatus("device", "Ready : " + socket.id + " - complexId : " + socketData.complexId + " - fieldId : " + socketData.fieldId);
            socket.join([socketData.complexId, socketData.fieldId]);
            this.manager.in(socketData.complexId).emit('isConnected', socketData.fieldId, true);
            this.admin.emit('isConnected', socketData.complexId, socketData.fieldId, true);
        }
        return true;
    }

    private async deviceDisonnected(socket: Socket) : Promise<void> {
        let socketData = this.socketDataService.get(socket);
        if (socketData.complexId && socketData.fieldId) {
            this.manager.in(socketData.complexId).emit('isConnected', socketData.fieldId, false);
            this.admin.emit('isConnected', socketData.complexId, socketData.fieldId, false);
        }
    }

    private async deviceDispatchMessage(socket : Socket) : Promise<void> {
        const self = this;
        socket.on('command', function(action, params) {
            const socketData = self.socketDataService.get(socket);
            let useRedirection = true;
            self.logSocketStatus("device", "Cmd - " + socket.id + " - fieldId : " + socketData?.fieldId + "- action : " + action + " - params : " + JSON.stringify(params));
            if (action == 'status/ipaddresses') {
                SocketDeviceController.ipAddress(self.context, socket, params);
                useRedirection = false;
            }
            if (action == 'status/versions') {
                SocketDeviceController.versions(self.context, socket, params);
                useRedirection = false;
            }

            if (action == SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL) {
                SocketDeviceController.webRTCTunnel(self.context, socket, params);
                useRedirection = false;
            }

            if (action == SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_STOP) {
                SocketDeviceController.webRTCTunnelStop(self.context, socket, params);
                useRedirection = false;
            }

            if (useRedirection && socketData.complexId && socketData.fieldId) {
                // Redirections
                self.manager.in(socketData.complexId).emit('message', socketData.fieldId, action, params);
                self.admin.emit('message', socketData.complexId, socketData.fieldId, action, params);
            }
        });
    }

    // --------------------------------------------------------- //
    // --------------------------------------------------------- //
    // --------------------       MANAGER        --------------- //
    // --------------------------------------------------------- //
    // --------------------------------------------------------- //

    private async managerInitConnection(socket: Socket) : Promise<boolean> {
        const query = socket.handshake.query;
        
        let version = 1;
        if (query && query._v) {
          let currentVersion = Number(query._v);
          if (!isNaN(currentVersion))
            version = currentVersion;
        }
      
        let socketError : SocketEmitError = SocketEmitError.NO_ERROR;
        if (query && query.token){
          const token = query.token as string;
          try{
            let complex = null;
            if(version > 1) { // check local token
              await this.sportbakService.tokenService.socketManagerTokenIsValid(token, async (success: boolean, error : number) => {
                if (success) {
                  await this.sportbakService.tokenService.tokenUsed(token);
                } else {
                  socketError = SocketEmitError.NO_ERROR;
                  if (error == -1) {
                    socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_ALREADY_USED;
                  } else if (error == -2) {
                    socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_EXPIRED;
                  } else if (error == -3) {
                    socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_DOES_NOT_EXIST;
                  } else if (error == -4) {
                    socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_INVALID;
                  }
                }
              })
      
              if (!socketError) {
                const data = await this.sportbakService.tokenService.getTokenData(token, true);
                if (data && data.complexId) {
                  complex = await this.sportbakService.getComplexById(data.complexId);
                } else {
                  socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_HAVE_NOT_DATA;
                }
              }
            } else { // token is the token of user from api.sportbak.com
              complex = await this.sportbakService.getComplex(token);
            }
      
            if(!socketError) {
              let fields = [];
              if (complex) {
                const socketData : PartialSocketData = {
                  complexId : String(complex._id)
                }
                if (fields) {
                  fields = complex.fields;
                  socketData.fieldIds = fields.map((f) => String(f._id));
                }
                this.socketDataService.set(socket, socketData);
              }
              socket.data.fields = fields;
            }
          }catch(e){
            socketError = SocketEmitError.AUTH_FAILED_LOAD_FIELDS;
          }
        }else{
          socketError = SocketEmitError.AUTH_WRONG_TOKEN;
        }
        socket.data.error = socketError;
        return !socketError;
    }

    private async managerConnected(socket: Socket) : Promise<boolean> {
        let socketData = this.socketDataService.get(socket);
        if (socketData.complexId) {
            this.logSocketStatus("manager", "Ready : " + socket.id + " - complexId : " + socketData.complexId);
            socket.join([socketData.complexId]);
            const socketIdsForComplex = this.getSocketIdsOfRoomId(this.device, socketData.complexId);
            for (let fieldId of socketData.fieldIds) {
                const isConnected = this.getSocketIdsOfRoomId(this.device, fieldId).length ? true : false;
                socket.emit('isConnected', fieldId, isConnected);
            }
            for (let socketId of socketIdsForComplex) {
                const currSocketData = this.socketDataService.get(socketId);
                if (currSocketData) {
                    if (currSocketData.clientIpAddress) {
                        socket.emit('message', currSocketData.fieldId, 'status/ipaddresses', {localIPAddresses : currSocketData.clientIpAddress})
                    }
                    this.logSocketStatus("manager", "Device connected - ipaddress : " + currSocketData.clientIpAddress);
                }
            }
            this.device.in(socketData.complexId).emit('command', 'session/current-session');
        }
        return true;
    }

    private async managerDisonnected(socket: Socket) : Promise<void> {        
    }

    private async managerDispatchMessage(socket : Socket) : Promise<void> {
        socket.on('isConnected', function(fieldId) {
            SocketManagerController.isConnected(this.context, socket, fieldId);
        });
         
        socket.on('command', (fieldId, action, params) => {
            // Redirection
            let useRedirection = true;

            if(action == SocketCommandesMessageAction.WEBRTC_IS_ENABLED) {
                SocketManagerController.webRTCIsEnabled(this.context, socket, fieldId, params);
                useRedirection = false;
            }

            if (useRedirection) {
                this.logSocketStatus("manager", "Cmd - " + socket.id + " - fieldId : " + fieldId + "- action : " + action + " - params : " + JSON.stringify(params));
                this.device.in(fieldId).emit('command', action, params);
            }
            
            /*if (action == 'something') {
                // SocketManagerController....
            }*/
        });
    }

    // --------------------------------------------------------- //
    // --------------------------------------------------------- //
    // --------------------       ADMIN        --------------- //
    // --------------------------------------------------------- //
    // --------------------------------------------------------- //

    private async adminInitConnection(socket: Socket) : Promise<boolean> {
        const query = socket.handshake.query;
      
        let socketError : SocketEmitError = SocketEmitError.NO_ERROR;
        if (query && query.token){
            const token = query.token as string;
            await this.sportbakService.tokenService.socketManagerAdminIsValid(token, async (success: boolean, error : number) => {
                if (success) {
                    await this.sportbakService.tokenService.tokenUsed(token);
                    } else {
                    socketError = SocketEmitError.NO_ERROR;
                    if (error == -1) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_ALREADY_USED;
                    } else if (error == -2) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_EXPIRED;
                    } else if (error == -3) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_DOES_NOT_EXIST;
                    } else if (error == -4) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_INVALID;
                    }
                }
            })
        }else{
          socketError = SocketEmitError.AUTH_WRONG_TOKEN;
        }
        socket.data.error = socketError;
        return !socketError;
    }

    private async adminConnected(socket: Socket) : Promise<boolean> {
        const devices = this.deviceSockets;
        for (let d of devices) {
            const socketData = this.socketDataService.get(d);
            if (socketData.complexId && socketData.fieldId) {
                this.admin.emit('isConnected', socketData.complexId, socketData.fieldId, true);
                d.emit('command', 'status/ipaddresses');
                d.emit('command', 'status/versions');
                d.emit('command', 'session/current-session');
            }
        }
        return true;
    }

    private async adminDisonnected(socket: Socket) : Promise<void> {

    }

    private async adminDispatchMessage(socket : Socket) : Promise<void> {
        socket.on('isConnected', function(fieldId) {
            SocketAdminController.isConnected(this.context, socket, fieldId);
        });
         
        socket.on('command', (fieldId, action, params) => {
            // Redirection
            this.logSocketStatus("manager", "Cmd - " + socket.id + " - fieldId : " + fieldId + "- action : " + action + " - params : " + JSON.stringify(params));
            this.device.in(fieldId).emit('command', action, params);

            /*if (action == 'something') {
                // SocketAdminController....
            }*/
        });
    }

    // --------------------------------------------------------- //
    // --------------------------------------------------------- //
    // --------------------       WEBRTC        --------------- //
    // --------------------------------------------------------- //
    // --------------------------------------------------------- //

    private async webRTCInitConnection(socket: Socket) : Promise<boolean> {
        const query = socket.handshake.query;
      
        let socketError : SocketEmitError = SocketEmitError.NO_ERROR;
        if (query && query.token){
            const token = query.token as string;
            await this.sportbakService.tokenService.socketManagerWebRTCIsValid(token, async (success: boolean, error : number) => {
                if (success) {
                    await this.sportbakService.tokenService.tokenUsed(token);
                    } else {
                    socketError = SocketEmitError.NO_ERROR;
                    if (error == -1) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_ALREADY_USED;
                    } else if (error == -2) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_EXPIRED;
                    } else if (error == -3) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_DOES_NOT_EXIST;
                    } else if (error == -4) {
                        socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_INVALID;
                    }
                }

                if (!socketError) {
                    const data = await this.sportbakService.tokenService.getTokenData(token, true);
                    if (data && data.complexId && data.fieldId) {
                        const socketData : PartialSocketData = {
                            complexId : data.complexId,
                            fieldId : data.fieldId
                        };
                        this.socketDataService.set(socket, socketData);
                    } else {
                      socketError = SocketEmitError.SOCKET_MANAGER_TOKEN_HAVE_NOT_DATA;
                    }
                }
            })
        }else{
          socketError = SocketEmitError.AUTH_WRONG_TOKEN;
        }
        socket.data.error = socketError;
        return !socketError;
    }

    private async webRTCConnected(socket: Socket) : Promise<boolean> {
        const socketData = this.socketDataService.get(socket);
        if (socketData.fieldId) {
            this.device.in(socketData.fieldId).emit('command', SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_START, {
                id : socket.id,
                platform : 'managerwebsite'
            });
        }
        
        return true;
    }

    private async webRTCDisonnected(socket: Socket) : Promise<void> {
        const socketData = this.socketDataService.get(socket);
        if (socketData.fieldId) {
            this.device.in(socketData.fieldId).emit('command', SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_STOP, {
                id : socket.id
            });
        }
    }

    private async webRTCDispatchMessage(socket : Socket) : Promise<void> {
        socket.on('message', (message : string) => {
            const socketData = this.socketDataService.get(socket);
            if (socketData?.fieldId) {
                this.logSocketStatus("webrtc", "Cmd - " + socket.id + " - fieldId : " + socketData?.fieldId + "- message : " + message);
                this.device.in(socketData?.fieldId).emit('command', SocketCommandesMessageAction.WEBRTC_FROM_EXTERNAL_TUNNEL, {
                    id : socket.id,
                    data : message
                });
            }
        });
    }

    // --------------------------------------------------------- //
    // --------------------------------------------------------- //
    // --------------------       UTILITIES        --------------- //
    // --------------------------------------------------------- //
    // --------------------------------------------------------- //

    public getSocketById(sockets: Socket[], id : string) {
        if (!sockets) return null;
        return sockets.find((s) => s.id == id);
    }

    public getWebRTCSocketById(id : string) {
        return this.getSocketById(this.webrtcSockets, id);
    }

    public getDeviceSocketById(id : string) {
        return this.getSocketById(this.deviceSockets, id);
    }

    public getSocketIdsOfRoomId(socketServer : SocketServer, roomId : string) : string[] {
        return Array.from(socketServer.adapter.rooms.get(roomId) || []);
    }

    private logSocketStatus(type : string, str : string) {
        console.log("# " + type.toUpperCase() + " # - " + str);
    }
}