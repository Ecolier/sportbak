import { Service } from 'typedi';

export enum SocketEmitError {
    NO_ERROR = 0,
    AUTH_WRONG_KEY_SECRECT,             // code : -1
    AUTH_FAILED_LOAD_DATA_FROM_FIELDID,     // code : -2
    AUTH_WRONG_TOKEN,                       // code : -3
    AUTH_FAILED_LOAD_FIELDS,                // code : -4
    UNKNOW,                                 // code : -5
    SOCKET_TOKEN_HAVE_NOT_TYPE,             // code : -6
    SOCKET_MANAGER_TOKEN_INVALID,           // code : -7
    SOCKET_MANAGER_TOKEN_EXPIRED,           // code : -8
    SOCKET_MANAGER_TOKEN_ALREADY_USED,      // code : -9
    SOCKET_MANAGER_TOKEN_DOES_NOT_EXIST,    // code : -10
    SOCKET_MANAGER_TOKEN_HAVE_NOT_DATA      // code : -11
}

export enum SocketReceiveManagerError {
}

export enum SocketReceiveDeviceError {
}

type SocketEmitErrorData = {code? : SocketEmitError, message : string, data? : any}
const errors : {[k in SocketEmitError] : SocketEmitErrorData} = {
    [SocketEmitError.NO_ERROR] : {message : 'No error ...'},
    [SocketEmitError.AUTH_WRONG_KEY_SECRECT] : {message : 'Wrong key and secret or missing...'},
    [SocketEmitError.AUTH_FAILED_LOAD_DATA_FROM_FIELDID] : {message : 'Error loading data from field id ...'},
    [SocketEmitError.AUTH_WRONG_TOKEN] : {message : 'Wrong token or missing ...'},
    [SocketEmitError.AUTH_FAILED_LOAD_FIELDS] : {message : 'Error loading fields with token ...'},
    [SocketEmitError.UNKNOW] : {message : "Unknow error ..."},
    [SocketEmitError.SOCKET_TOKEN_HAVE_NOT_TYPE] : {message : "Socket token have not any type ..."},
    [SocketEmitError.SOCKET_MANAGER_TOKEN_EXPIRED] : {message : "Socket manager Token expired ..."},
    [SocketEmitError.SOCKET_MANAGER_TOKEN_INVALID] : {message : "Socket manager Token is invalid ..."},
    [SocketEmitError.SOCKET_MANAGER_TOKEN_ALREADY_USED] : {message : "Socket manager Token already used ..."},
    [SocketEmitError.SOCKET_MANAGER_TOKEN_DOES_NOT_EXIST] : {message : "Socket manager Token doesn't exists ..."},
    [SocketEmitError.SOCKET_MANAGER_TOKEN_HAVE_NOT_DATA] : {message : "Socket manager Token have not data ..."}

}

@Service()
export default class SocketErrorService {
    
    emitError(socket, error : SocketEmitError, disconnet : boolean = true) {
        let data = errors[error];
        data.code = -1 * error;
        socket.emit('error', errors[error]);
        socket.disconnect();
    }
}