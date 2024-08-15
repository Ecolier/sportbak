import { io, Socket } from 'socket.io-client';
import { Service } from 'typedi';
import ContextService from './context.service';
import * as socketController from '../controllers/socket.controller';
import * as dataController from '../controllers/data.controller';
import axios from 'axios';
import { Complex } from '../models/complex.model';
import { Field } from '../models/field.model';
import Config from '../models/config.model';
import { StartSessionInput } from '../models/start.session.input';
import { SocketReceiveBackendError, SocketReceiveBackendErrorData } from './socket.error.service';
import externalUrlsConfig from '../config/externalUrls.config';

class SocketAdpater{
        private client : Socket;

        constructor(client : Socket){
                this.client = client;
        }

        send(message: string){
                const msgObj = JSON.parse(message);
                this.client.emit(msgObj['action'], msgObj['params']);
        }
}

@Service("sportbak.service")
export default class SportbakService{

        client : Socket;        
        serviceUrl: string;
        complex : Complex;
        field : Field;
        defaultStartSession : StartSessionInput;

        constructor(contextService: ContextService, config : Config){
                this.serviceUrl = externalUrlsConfig.apiVideo;
                this.init(contextService, config);
        }

        private init(contextService: ContextService, config : Config) {
                this.reload(contextService, config);
        }

        private close() {
                if (this.client.connected)
                        this.client.disconnect();
                this.client.close();
                this.client = null;
                console.log("Socket closed ...");
        }

        reload(contextService: ContextService, config : Config) {
                if (this.client) {
                        this.close();
                }

                this.client = io(this.serviceUrl + '/device',  {
                        query: { key: config.apiKey, secret: config.apiSecret },
                        forceNew : true
                });

                this.client.on("init", (data) => {
                        this.complex = data.complex;
                        this.field = data.field;
                        this.defaultStartSession = data.defaultStartSession;
                        contextService.overlayService.reloadImages();
                        dataController.broadcastLogged(contextService);
                });

                this.client.on("error", (data : SocketReceiveBackendErrorData) => {
                        console.log("authentification - error - id : " + this.client.id + " - data : " + JSON.stringify(data));
                        if (data.code == -SocketReceiveBackendError.AUTH_WRONG_KEY_SECRECT) {
                                contextService.adminCommandesServices.resetApiKeys(contextService, false);
                                this.close();
                        }
                });

                this.client.on("connect", () => {
                        console.log("connected with id " + this.client.id);
                        contextService.socketDataService.add(this.client);
                });

                this.client.on("command", (action, params) => {
                        if (!params) params = {};
                        socketController.onMessage(contextService, this.client, JSON.stringify({'action': action, 'params': params}))
                });

                this.client.on("disconnect", () => {
                        console.log("disconnected from id " + this.client.id);
                        contextService.socketDataService.remove(this.client);
                        this.clear();
                });
        }

        async login(username, password){
                const fields = await axios.post(this.serviceUrl+'/onboarding/login', {
                          username: username,
                          password: password
                });
                return fields.data;
        }

        async isComplexManager(token, complexId) : Promise<boolean> {
                const response = await axios.get(this.serviceUrl + '/webrtc/complexmanager/authorized/' + complexId, {
                        headers: { 'Authorization': `Bearer ${token}` }
                });
                return response.data.result;
        }

        async selectField(token, complexId, fieldId){
                const fields = await axios.post(this.serviceUrl+'/onboarding/create', {
                        token : token,
                        fieldId: fieldId,
                        complexId: complexId
              });
              return fields.data;            
        }

        clear() {
                this.complex = null;
                this.field = null;
        }
}

