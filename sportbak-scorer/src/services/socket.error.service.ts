import ws from 'ws';
import { DateConstants } from '../constants/data.constant';

export enum SocketEmitError {
    UNKNOW = 1,
    SOCKET_TOKEN_EXPIRED,
    SOCKET_TOKEN_ALREADY_USED,
    SOCKET_TOKEN_DOES_NOT_EXIST,
    SOCKET_TOKEN_INVALID
}

export enum SocketReceiveBackendError {
    AUTH_WRONG_KEY_SECRECT = 1,             // code : -1
    AUTH_FAILED_LOAD_DATA_FROM_FIELDID,     // code : -2
    AUTH_WRONG_TOKEN,                       // code : -3
    AUTH_FAILED_LOAD_FIELDS,                // code : ...
}


export type SocketReceiveBackendErrorData = {code? : SocketReceiveBackendError, message : string, data? : any}

type SocketEmitErrorData = {code? : SocketEmitError, message : string, data? : any}
const errors : {[k in SocketEmitError] : SocketEmitErrorData} = {
    [SocketEmitError.UNKNOW] : {message : "Unknow error ..."},
    [SocketEmitError.SOCKET_TOKEN_EXPIRED] : {message : "Socket Token expired ..."},
    [SocketEmitError.SOCKET_TOKEN_ALREADY_USED] : {message : "Socket Token already used ..."},
    [SocketEmitError.SOCKET_TOKEN_DOES_NOT_EXIST] : {message : "Socket Token doesn't exists ..."},
    [SocketEmitError.SOCKET_TOKEN_INVALID] : {message : "Socket Token is invalid ..."}
}

export default class SocketErrorService {
    
    async emitError(socket : ws, error : SocketEmitError, disconnet : boolean = true) {
        let data = errors[error];
        data.code = -1 * error;
        let message = {action : 'error', ...errors[error]};
        await new Promise<void>((resolve) => {
            socket.send(JSON.stringify(message), () => {
                if (disconnet) {
                    socket.close(); 
                } 
                resolve();
            });    
        });
    }
}