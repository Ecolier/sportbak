import mongoose, { Document } from 'mongoose';

export enum TokenTypes {
    socketWebRTC = "socket_webrtc",
    socketBarApp = "socket_barapp",
    socketFrontend = "socket_frontend",
}


const schema = new mongoose.Schema({
    value : { 
        type: String
    },
    expireAt : { 
        type: Date
    },
    data : { 
        type: String
    },
    used : {
        type : Number,
        default : 0
    },
    type : {
        type: String, 
        enum: [ TokenTypes.socketWebRTC, TokenTypes.socketBarApp, TokenTypes.socketFrontend ]
    }
});

export interface IToken extends Document {
    value: string;
    expireAt: Date;
    data: string;
    used : number,
    type : TokenTypes
}

schema.index({ expireAt: -1});
export default mongoose.model<IToken>('Token', schema);