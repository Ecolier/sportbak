
import crypto from 'crypto';
import { DateConstants } from '../constants/date.constant';

import Token, { IToken, TokenTypes } from '../models/token.model';

const delayClearSocket = 5 * DateConstants.day;

const delayExpirationSocketManagerToken = 1 * DateConstants.day;
const delayExpirationSocketAdminToken = 1 * DateConstants.hour;
const delayExpirationSocketWebRTCToken = 1 * DateConstants.hour;


export class TokenService {

    public async clearOldTokens() {
        await Token.deleteMany({expireAt : {$lt : new Date(new Date().getTime() - delayClearSocket)}});
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

    public async createSocketManagerToken(complexId : string) {
        const expireAt = new Date(new Date().getTime() + delayExpirationSocketManagerToken);
        const data = {
            complexId : complexId
        }
        return await this.createToken(expireAt, TokenTypes.socketManager, JSON.stringify(data));
    }

    public async createSocketAdminToken() {
        const expireAt = new Date(new Date().getTime() + delayExpirationSocketAdminToken);
        return await this.createToken(expireAt, TokenTypes.socketAdmin);
    }

    public async createSocketWebRTCToken(complexId : string, fieldId : string) {
        const expireAt = new Date(new Date().getTime() + delayExpirationSocketWebRTCToken);
        const data = {
            complexId : complexId,
            fieldId : fieldId
        }
        return await this.createToken(expireAt, TokenTypes.socketWebRTC, JSON.stringify(data));
    }

    public async getToken(token : string) : Promise<IToken> {
        return Token.findOne({value : token});
    }

    public async getTokenData(token : string, parsed = false) : Promise<string | any> {
        let doc = await Token.findOne({value : token});
        return parsed ? JSON.parse(doc.data) : doc.data;
    }

    public async socketManagerTokenIsValid(token : string, callback : (success : boolean, error : number) => void | Promise<void> = null) : Promise<boolean> {
        let result = false;
        let doc = await this.getToken(token);
        let error = 0;
        if (doc) {
            const now = new Date();
            if (doc.type != TokenTypes.socketManager) {
                error = -4;
                console.log("SocketManagerToken is invalid ...");
            } else if (!doc.expireAt || doc.expireAt.getTime() > now.getTime()) {
                result = true;
            } else {
                error = -2;
                console.log("SocketManagerToken expired ...");
            } 
        } else {
            error = -3;
            console.log("SocketManagerToken doesn't exist ...");
        }
        if (callback) {
            const c = callback(result, error);
            if (c instanceof Promise)
                await c;
        }
        return result;
    }

    public async socketManagerAdminIsValid(token : string, callback : (success : boolean, error : number) => void | Promise<void> = null) : Promise<boolean> {
        let result = false;
        let doc = await this.getToken(token);
        let error = 0;
        if (doc) {
            const now = new Date();
            if (doc.type != TokenTypes.socketAdmin) {
                error = -4;
                console.log("Socket Admin Token is invalid ...");
            } else if (!doc.expireAt || doc.expireAt.getTime() > now.getTime()) {
                result = true;
            } else {
                error = -2;
                console.log("Socket Admin Token expired ...");
            } 
        } else {
            error = -3;
            console.log("Socket Admin Token doesn't exist ...");
        }
        if (callback) {
            const c = callback(result, error);
            if (c instanceof Promise)
                await c;
        }
        return result;
    }

    public async socketManagerWebRTCIsValid(token : string, callback : (success : boolean, error : number) => void | Promise<void> = null) : Promise<boolean> {
        let result = false;
        let doc = await this.getToken(token);
        let error = 0;
        if (doc) {
            const now = new Date();
            if (doc.type != TokenTypes.socketWebRTC) {
                error = -4;
                console.log("Socket WebRTC Token is invalid ...");
            } else if (!doc.expireAt || doc.expireAt.getTime() > now.getTime()) {
                result = true;
            } else {
                error = -2;
                console.log("Socket WebRTC Token expired ...");
            } 
        } else {
            error = -3;
            console.log("Socket WebRTC Token doesn't exist ...");
        }
        if (callback) {
            const c = callback(result, error);
            if (c instanceof Promise)
                await c;
        }
        return result;
    }

    public async tokenUsed(token : string) : Promise<IToken> {
        return await Token.findOneAndUpdate({value : token}, {$inc : {used : 1}});
    }
}