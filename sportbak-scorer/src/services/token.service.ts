
import crypto from 'crypto';
import { DateConstants } from '../constants/data.constant';

import Token, { IToken, TokenTypes } from '../models/token.model';

const delayExpirationWebRTC = 5 * DateConstants.minute;
const delayClearWebRTCTokens = 1 * DateConstants.day;

const delayExpirationBarApp = 1 * DateConstants.day;
const delayClearBarAppTokens = 5 * DateConstants.day;

const delayExpirationFrontend = 1 * DateConstants.day;
const delayClearFrontendTokens = 5 * DateConstants.day;

export class TokenService {

    public async clearOldTokens() {
        const types = [TokenTypes.socketWebRTC, TokenTypes.socketBarApp, TokenTypes.socketFrontend];
        const delay = [delayClearWebRTCTokens, delayClearBarAppTokens, delayClearFrontendTokens];
        const now = new Date();
        for (let i = 0; i < types.length; i++) {
            await Token.deleteMany({type: types[i], expireAt : {$lt : new Date(now.getTime() - delay[i])}});
        }
        await Token.deleteMany({type: {$nin : types}});
    }

    private async createToken(expireAt : Date, type : TokenTypes, data : string = null) : Promise<IToken> {
        let document = {
            value : crypto.randomBytes(64).toString('hex'),
            expireAt : expireAt,
            data : data,
            type : type
        };
        return await Token.create(document);
    }

    public async createWebRTCToken(data : string = null) {
        return await this.createToken(new Date(new Date().getTime() + delayExpirationWebRTC), TokenTypes.socketWebRTC, data);
    }

    public async createBarAppToken(data : string = null) {
        return await this.createToken(new Date(new Date().getTime() + delayExpirationBarApp), TokenTypes.socketBarApp, data);
    }

    public async createFrontendToken(data : string = null) {
        return await this.createToken(new Date(new Date().getTime() + delayExpirationFrontend), TokenTypes.socketFrontend, data);
    }


    public async getToken(token : string) : Promise<IToken> {
        return Token.findOne({value : token});
    }

    public async webRTCTokenIsValid(token : string, callback : (success : boolean, error : number) => void = null) : Promise<boolean> {
        let result = false;
        let doc = await this.getToken(token);
        let error = 0;
        if (doc) {
            const now = new Date();
            if (doc.type != TokenTypes.socketWebRTC) {
                error = -4;
                console.log("WebRTCToken is invalid ...");
            } else if (!doc.expireAt || doc.expireAt.getTime() > now.getTime()) {
                if (doc.used < 1) {
                    result = true;
                } else {
                    error = -1;
                    console.log("WebRTCToken already used ...");
                }
            } else {
                error = -2;
                console.log("WebRTCToken expired ...");
            }
        } else {
            error = -3;
            console.log("WebRTCToken doesn't exist ...");
        }
        if (callback) {
            callback(result, error);
        }
        return result;
    }

    public async barAppTokenIsValid(token : string, callback : (success : boolean, error : number) => void = null) : Promise<boolean> {
        let result = false;
        let doc = await this.getToken(token);
        let error = 0;
        if (doc) {
            const now = new Date();
            if (doc.type != TokenTypes.socketBarApp) {
                error = -4;
                console.log("BarAppToken is invalid ...");
            } else if (!doc.expireAt || doc.expireAt.getTime() > now.getTime()) {
                result = true;
            } else {
                error = -2;
                console.log("BarAppToken expired ...");
            }
        } else {
            error = -3;
            console.log("BarAppToken doesn't exist ...");
        }
        if (callback) {
            callback(result, error);
        }
        return result;
    }

    public async frontendTokenIsValid(token : string, callback : (success : boolean, error : number) => void = null) : Promise<boolean> {
        let result = false;
        let doc = await this.getToken(token);
        let error = 0;
        if (doc) {
            const now = new Date();
            if (doc.type != TokenTypes.socketFrontend) {
                error = -4;
                console.log("FrontendToken is invalid ...");
            } else if (!doc.expireAt || doc.expireAt.getTime() > now.getTime()) {
                result = true;
            } else {
                error = -2;
                console.log("FrontendToken expired ...");
            }
        } else {
            error = -3;
            console.log("WebRTCToken doesn't exist ...");
        }
        if (callback) {
            callback(result, error);
        }
        return result;
    }

    public async tokenUsed(token : string) : Promise<IToken> {
        return await Token.findOneAndUpdate({value : token}, {$inc : {used : 1}});
    }
}